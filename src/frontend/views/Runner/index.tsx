import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import Tooltip from 'antd/lib/tooltip';
import { selectFile } from '../../utils/file';

import './index.scss';

@inject((stores: any) => {
  const { userDefaultProjectPath } = stores.workStation;
  return {
    userDefaultProjectPath,
    kill: () => stores.terminal.kill(),
    clear: () => stores.terminal.clear(),
    setExecPath: (str: string, force: boolean) =>
      stores.terminal.setExecPath(str, force),
    shell: (str: string) => stores.terminal.shell(str),
    setUserDefaultProjerctPath: (str: string) =>
      stores.workStation.setUserDefaultProjerctPath(str),
  };
})
@observer
class RunnerView extends React.Component<any, any> {
  constructor(props: object) {
    super(props);
    if (this.props.userDefaultProjectPath) {
      this.props.setExecPath(this.props.userDefaultProjectPath);
    }
  }

  @action
  public handleSelectDir(el: HTMLInputElement) {
    selectFile(
      {
        message: '选择工程目录',
        properties: ['openDirectory'],
      },
      (res: string[] | undefined) => {
        if (res) {
          const dir = res[0];
          this.props.setUserDefaultProjerctPath(dir);
          el.value = dir;
          this.props.setExecPath(dir);
        }
      }
    );
  }

  public commander(str: string) {
    const { shell } = this.props;
    if (this.props.userDefaultProjectPath) {
      notification.success({
        message: '已运行',
        description: '请勿重复操作.',
      });
      shell(str);
    } else {
      message.warn('请选择工程目录！');
    }
  }

  public killProcess() {
    this.props.kill();
    this.props.clear();
    setTimeout(() => {
      message.info('当前进程已结束！');
      this.props.setExecPath(this.props.userDefaultProjectPath, true);
    }, 600);
  }

  public render() {
    const isWin = process.platform === 'win32';
    const { userDefaultProjectPath } = this.props;

    return (
      <div className="sub-page-runner">
        <div className="form-table">
          <div className="form-item">
            <div className="label">选择工程目录</div>
            <div className="form">
              <Input
                size="large"
                placeholder="点击选择工程目录"
                readOnly={true}
                defaultValue={userDefaultProjectPath}
                onClick={(e: any) => {
                  this.handleSelectDir(e.target);
                }}
                suffix={<Icon type="project" />}
              />
            </div>
          </div>
          <div className="form-item">
            <div className="label">开发命令选项</div>
            <div className="comand-table">
              {!isWin && (
                <div className="row">
                  <div className="desc">工程目录sudo授权（需输入密码）</div>
                  <div className="control">
                    <Tooltip placement="right" title="启动命令">
                      <div
                        className="btn-default"
                        onClick={() => {
                          this.commander(
                            `sudo chmod -R 777 ${userDefaultProjectPath}\n`
                          );
                        }}
                      >
                        <i className="iconfont">&#xe603;</i>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="desc">本地开发模式</div>
                <div className="control">
                  <Tooltip placement="left" title="结束进程">
                    <div
                      className="btn-default btn-kill"
                      onClick={() => {
                        this.killProcess();
                      }}
                    >
                      <i className="iconfont">&#xe716;</i>
                    </div>
                  </Tooltip>
                  <Tooltip placement="right" title="启动命令">
                    <div
                      className="btn-default"
                      onClick={() => {
                        this.commander('npm run serve\n');
                      }}
                    >
                      <i className="iconfont">&#xe603;</i>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="row">
                <div className="desc">项目构建打包</div>
                <div className="control">
                  <Tooltip placement="right" title="启动命令">
                    <div
                      className="btn-default"
                      onClick={() => {
                        this.commander('npm run build\n');
                      }}
                    >
                      <i className="iconfont">&#xe603;</i>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="row">
                <div className="desc">单元模块测试</div>
                <div className="control">
                  <Tooltip placement="right" title="启动命令">
                    <div
                      className="btn-default"
                      onClick={() => {
                        this.commander('npm run test:unit\n');
                      }}
                    >
                      <i className="iconfont">&#xe603;</i>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RunnerView;
