import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import Tooltip from 'antd/lib/tooltip';
import { selectFile } from '../../utils/file';
import { isMac } from '../../utils/env';

import './index.scss';

@inject((stores: any) => {
  const { userDefaultProjectPath, projectRunnerConfig } = stores.workStation;
  return {
    userDefaultProjectPath,
    projectRunnerConfig,
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
  @action
  public handleSelectDir() {
    selectFile(
      {
        message: '选择工程目录',
        properties: ['openDirectory'],
      },
      (res: string[] | undefined) => {
        if (res) {
          const dir = res[0];
          this.props.setUserDefaultProjerctPath(dir);
          this.props.setExecPath(dir);
        }
      }
    );
  }

  public commander(str: string, noTips?: boolean) {
    const { shell } = this.props;
    const sudo = isMac ? 'sudo ' : '';
    if (this.props.userDefaultProjectPath) {
      if (!noTips) {
        notification.success({
          message: '已运行',
          description: '请勿重复操作.',
        });
      }
      shell(sudo + str);
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
    const {
      userDefaultProjectPath,
      projectRunnerConfig: {
        configList: { command },
        noProject,
        noConfig,
      },
    } = this.props;

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
                value={userDefaultProjectPath}
                onClick={(e: any) => {
                  this.handleSelectDir();
                }}
                suffix={<Icon type="project" />}
              />
            </div>
          </div>
          <div className="form-item">
            <div className="label">开发命令选项</div>
            {(noProject || noConfig) && (
              <div className="no-result" data-info="暂未找到该项目或命令配置" />
            )}
            {!noProject && !noConfig && (
              <div className="comand-table">
                {command &&
                  command.map((item: any, index: number) => (
                    <div className="row" key={index}>
                      <div className="desc">{item.name}</div>
                      <div className="control">
                        {item.needCancel && (
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
                        )}
                        <Tooltip placement="right" title="启动命令">
                          <div
                            className="btn-default"
                            onClick={() => {
                              this.commander(`${item.shell}\n`);
                            }}
                          >
                            <i className="iconfont">&#xe603;</i>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default RunnerView;
