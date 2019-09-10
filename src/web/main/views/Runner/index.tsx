import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import Collapse from 'antd/lib/collapse';
import notification from 'antd/lib/notification';
import Tooltip from 'antd/lib/tooltip';
import { shell } from 'electron';
import * as clipBoard from '../../bridge/modules/clipBoard';
import { selectFile } from '../../bridge/modules/file';
import { isMac } from '../../bridge/modules/env';

const { Panel } = Collapse;

import './index.scss';

@inject((stores: any) => {
  const {
    workBench: { userDefaultProjectPath, projectRunnerConfig },
    device: { ipAddress },
  } = stores;
  return {
    userDefaultProjectPath,
    projectRunnerConfig,
    ipAddress,
    kill: () => stores.terminal.kill(),
    setExecPath: (str: string, force: boolean) =>
      stores.terminal.setExecPath(str, force),
    shell: (str: string) => stores.terminal.shell(str),
    setUserDefaultProjerctPath: (str: string) =>
      stores.workBench.setUserDefaultProjerctPath(str),
    refreshPorjectConfig: (cb: Function) =>
      stores.workBench.refreshPorjectConfig(cb),
    resetStateBar: () => stores.workBench.resetStateBar(),
    setStateBar: (str: string, code: number) =>
      stores.workBench.setStateBar(str, code),
  };
})
@observer
class RunnerView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      projectSyncState: false,
    };
  }

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

  public openProjectDir() {
    shell.showItemInFolder(this.props.userDefaultProjectPath);
  }

  public copyAddress(position: string[]) {
    const ip = `http://${this.props.ipAddress['local'] || 'localhost'}:${this
      .props.projectRunnerConfig.configList.port || 8080}/`;
    clipBoard.writeText(ip + position.join('/') + '.html');
    message.success('页面地址已复制到剪切板！');
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

  public refreshProject() {
    this.setState({ projectSyncState: true });
    this.props.refreshPorjectConfig(() => {
      message.success('刷新成功！');
      setTimeout(() => {
        this.setState({ projectSyncState: false });
      }, 2000);
    });
  }

  public runBundleCmd(cmd: string, bundleName: string) {
    const { shell, setStateBar } = this.props;
    const sudo = isMac ? 'sudo ' : '';
    shell(`${sudo}npm run ${cmd} ${bundleName}`);
    setStateBar(`npm scripts: ${cmd}`);
  }

  public killProcess() {
    this.props.kill();
    this.props.resetStateBar();
  }

  public render() {
    const {
      userDefaultProjectPath,
      projectRunnerConfig: {
        configList: {
          type,
          command,
          cheetahProject,
          // dist,
          scripts: { dev, build, zip },
        },
        noProject,
        noConfig,
      },
    } = this.props;

    const projectNames = Object.keys(cheetahProject || {});

    const runnerBtn = (bundleName: string) => (
      <div className="project-control">
        <Tooltip placement="bottom" title="业务包压缩">
          <Icon
            type="file-zip"
            onClick={(e: any) => {
              this.runBundleCmd(zip, bundleName);
              e.stopPropagation();
            }}
          />
        </Tooltip>
        <Tooltip placement="bottom" title="业务包构建">
          <Icon
            type="apartment"
            onClick={(e: any) => {
              this.runBundleCmd(build, bundleName);
              e.stopPropagation();
            }}
          />
        </Tooltip>
        <Tooltip placement="bottom" title="本地开发服务">
          <Icon
            type="play-circle"
            onClick={(e: any) => {
              this.runBundleCmd(dev, bundleName);
              e.stopPropagation();
            }}
          />
        </Tooltip>
      </div>
    );

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
              <div className="label">
                <div className="name">猎豹工程</div>
                <div
                  className="extra"
                  onClick={() => {
                    this.openProjectDir();
                  }}
                >
                  <Icon type="folder" />
                  <span>打开</span>
                </div>
                <div
                  className="extra"
                  onClick={() => {
                    this.refreshProject();
                  }}
                >
                  <Icon type="sync" spin={this.state.projectSyncState} />
                  <span>刷新</span>
                </div>
              </div>
              <div className="dir-list">
                <Collapse>
                  {projectNames.map((name: string, index: number) => (
                    <Panel key={index} header={name} extra={runnerBtn(name)}>
                      <Collapse>
                        {Object.keys(cheetahProject[name] || {}).map(
                          (dir: string, order: number) => (
                            <Panel key={order} header={dir}>
                              {Object.keys(cheetahProject[name][dir] || {}).map(
                                (page: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="page-item"
                                    onClick={(e: any) => {
                                      this.copyAddress([name, dir, page]);
                                    }}
                                  >
                                    <div className="name-title">
                                      {page}.html
                                    </div>
                                    <Tooltip
                                      placement="bottom"
                                      title="复制页面地址"
                                    >
                                      <Icon type="copy" />
                                      <span>复制</span>
                                    </Tooltip>
                                  </div>
                                )
                              )}
                            </Panel>
                          )
                        )}
                      </Collapse>
                    </Panel>
                  ))}
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
