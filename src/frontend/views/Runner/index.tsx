import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { selectFile } from '../../utils/file';

import './index.scss';

@inject((stores: any) => {
  return {
    kill: () => stores.terminal.kill(),
    shell: (str: string) => stores.terminal.shell(str),
  };
})
@observer
class RunnerView extends React.Component<any, any> {
  @observable public projectPath: string = '';

  @action
  public handleSelectDir(el: HTMLInputElement) {
    selectFile(
      {
        message: '选择工程目录',
        properties: ['openDirectory'],
      },
      (res: string[] | undefined) => {
        if (res) {
          this.projectPath = res[0];
          el.value = res[0];
          this.props.shell(`cd ${this.projectPath}\n`);
        }
      }
    );
  }

  public commander(str: string) {
    const { shell } = this.props;
    if (this.projectPath) {
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
    setTimeout(() => {
      message.info('当前进程已结束！');
      this.props.shell(`cd ${this.projectPath}\n`);
    }, 1000);
  }

  public render() {
    const isWin = process.platform === 'win32';

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
                defaultValue={this.projectPath}
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
                    <div
                      className="btn-default"
                      onClick={() => {
                        this.commander(
                          `sudo chmod -R 777 ${this.projectPath}\n`
                        );
                      }}
                    >
                      运行
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="desc">本地开发模式</div>
                <div className="control">
                  <div
                    className="btn-default btn-kill"
                    onClick={() => {
                      this.killProcess();
                    }}
                  >
                    结束
                  </div>
                  <div
                    className="btn-default"
                    onClick={() => {
                      this.commander('npm run serve\n');
                    }}
                  >
                    运行
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="desc">项目构建打包</div>
                <div className="control">
                  <div
                    className="btn-default"
                    onClick={() => {
                      this.commander('npm run build\n');
                    }}
                  >
                    运行
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="desc">单元模块测试</div>
                <div className="control">
                  <div
                    className="btn-default"
                    onClick={() => {
                      this.commander('npm run test:unit\n');
                    }}
                  >
                    运行
                  </div>
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
