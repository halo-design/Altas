import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import Collapse from 'antd/lib/collapse';
import notification from 'antd/lib/notification';
import Tooltip from 'antd/lib/tooltip';
import { selectFile } from '../../bridge/modules/file';
import { isMac } from '../../bridge/modules/env';

const { Panel } = Collapse;

import './index.scss';

@inject((stores: any) => {
  const { userDefaultProjectPath, projectRunnerConfig } = stores.workBench;
  return {
    userDefaultProjectPath,
    projectRunnerConfig,
    kill: () => stores.terminal.kill(),
    setExecPath: (str: string, force: boolean) =>
      stores.terminal.setExecPath(str, force),
    shell: (str: string) => stores.terminal.shell(str),
    setUserDefaultProjerctPath: (str: string) =>
      stores.workBench.setUserDefaultProjerctPath(str),
    resetStateBar: () => stores.workBench.resetStateBar(),
    setStateBar: (str: string, code: number) =>
      stores.workBench.setStateBar(str, code),
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
        if (res && res[0]) {
          const dir = res[0];
          this.props.setUserDefaultProjerctPath(dir);
          this.props.setExecPath(dir);
        }
      }
    );
  }

  public commander(str: string, title: string, noTips?: boolean) {
    const { shell, setStateBar } = this.props;
    const sudo = isMac ? 'sudo ' : '';
    if (this.props.userDefaultProjectPath) {
      if (!noTips) {
        notification.success({
          message: '已运行',
          description: '请勿重复操作.',
        });
      }
      shell(sudo + str);
      setStateBar(title);
    } else {
      message.warn('请选择工程目录！');
    }
  }

  public killProcess() {
    this.props.kill();
    this.props.resetStateBar();
  }

  public render() {
    const {
      userDefaultProjectPath,
      projectRunnerConfig: {
        configList: { type, command, cheetahProject },
        noProject,
        noConfig,
      },
    } = this.props;

    console.log(type, cheetahProject);

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
                              this.commander(item.shell, item.name);
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
          {type === 'cheetah' && (
            <div className="form-item">
              <div className="label">猎豹工程</div>
              <div className="dir-list">
                <Collapse>
                  <Panel
                    key={1}
                    header="demo"
                    extra={<Icon type="play-circle" />}
                  >
                    <Collapse>
                      <Panel key={1} header="demo">
                        <p>button</p>
                        <p>input</p>
                      </Panel>
                    </Collapse>
                  </Panel>
                  <Panel
                    key={2}
                    header="demo"
                    extra={<Icon type="play-circle" />}
                  >
                    <Collapse>
                      <Panel key={1} header="demo">
                        <p>button</p>
                        <p>input</p>
                      </Panel>
                    </Collapse>
                  </Panel>
                </Collapse>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RunnerView;
