import * as React from 'react';
import * as path from 'path';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import Collapse from 'antd/lib/collapse';
import notification from 'antd/lib/notification';
import Checkbox from 'antd/lib/checkbox';
import Tooltip from 'antd/lib/tooltip';
import { shell } from 'electron';
import * as clipBoard from '../../bridge/modules/clipBoard';
import { selectFile } from '../../bridge/modules/file';
import { isMac } from '../../bridge/modules/env';
import CreateContextMenu from '../../bridge/modules/CreateContextMenu';

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
  public activeIndex: boolean[] = [];
  public checkedBundles: string[] = [];
  public menuList: any[] = [];

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

  public openProjectDir(root?: string, modules?: string) {
    if (root && modules) {
      shell.showItemInFolder(
        path.join(this.props.userDefaultProjectPath, root, modules)
      );
    } else {
      shell.showItemInFolder(this.props.userDefaultProjectPath);
    }
  }

  public copyAddress(position: string[]) {
    const ip = `http://${this.props.ipAddress['local'] || 'localhost'}:${this
      .props.projectRunnerConfig.configList.port || 8080}/`;
    clipBoard.writeText(ip + position.join('/') + '.html');
    message.success('页面地址已复制到剪切板！');
  }

  public commander(str: string, title: string, noTips?: boolean) {
    let cmd = str;
    if (str.includes('$bundles')) {
      if (this.checkedBundles.length === 0) {
        message.warn('请勾选需要运行的目录.');
        return;
      } else {
        cmd = str.replace(/\$bundles/g, this.checkedBundles.join(' '));
      }
    }

    const { shell, setStateBar } = this.props;
    const sudo = isMac ? 'sudo ' : '';
    if (this.props.userDefaultProjectPath) {
      if (!noTips) {
        notification.success({
          message: '已运行',
          description: '请勿重复操作.',
        });
      }
      shell(sudo + cmd);
      setStateBar(title);
    } else {
      message.warn('请选择工程目录.');
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

  public runBundleCmd(cmd: string, bundleName: string | string[]) {
    const { shell, setStateBar } = this.props;
    const sudo = isMac ? 'sudo ' : '';
    if (Array.isArray(bundleName)) {
      if (bundleName.length === 0) {
        message.warn('请勾选需要运行的目录.');
      } else {
        shell(`${sudo}npm run ${cmd} ${bundleName.join(' ')}`);
      }
    } else {
      shell(`${sudo}npm run ${cmd} ${bundleName}`);
    }
    setStateBar(`npm scripts: ${cmd}`);
  }

  public killProcess() {
    this.props.kill();
    this.props.resetStateBar();
  }

  public setCheckIndex(e: any, index: number) {
    this.activeIndex[index] = e.target.checked;
    const { cheetahProject } = this.props.projectRunnerConfig.configList;

    if (cheetahProject) {
      const projectNames = Object.keys(cheetahProject);
      const bundles = projectNames.filter(
        (name: string, order: number) => this.activeIndex[order]
      );
      this.checkedBundles = bundles;
    }
  }

  public createMenu(node: HTMLElement, bundleName: string) {
    if (node) {
      const opts: any = [
        {
          click: (e: any) => {
            const {
              projectRunnerConfig: {
                configList: { modules },
              },
            } = this.props;

            if (modules) {
              this.openProjectDir(modules, bundleName);
            }
          },
          label: '打开文件夹',
        },
        {
          type: 'separator',
        },
        {
          click: (e: any) => {
            //
          },
          label: '粘贴上传图片',
        },
      ];

      const contextMenu = new CreateContextMenu(node, opts);
      this.menuList.push(contextMenu);
    }
  }

  public componentWillUnmount() {
    this.menuList.forEach((menu: any) => {
      menu.unbind();
    });
  }

  public render() {
    const {
      userDefaultProjectPath,
      projectRunnerConfig: {
        configList: {
          type,
          command,
          cheetahProject,
          scripts: { dev, build },
        },
        noProject,
        noConfig,
      },
    } = this.props;

    const projectNames = Object.keys(cheetahProject || {});

    const runnerBtn = (bundleName: string, index: number) => (
      <div className="project-control">
        <Tooltip placement="bottom" title="业务包构建">
          <Icon
            type="file-zip"
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
        <Checkbox
          onClick={(e: any) => {
            e.stopPropagation();
          }}
          onChange={(e: any) => {
            this.setCheckIndex(e, index);
          }}
        />
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

          {(noProject || noConfig) && (
            <div className="no-result" data-info="暂未找到该项目或命令配置" />
          )}

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
                <Collapse
                  expandIcon={({ isActive }) =>
                    isActive ? (
                      <Icon type="folder-open" style={{ fontSize: '14px' }} />
                    ) : (
                      <Icon type="folder" style={{ fontSize: '14px' }} />
                    )
                  }
                >
                  {projectNames.map((name: string, index: number) => (
                    <Panel
                      key={index}
                      header={
                        <div
                          className="bundle-name"
                          ref={(node: any) => {
                            this.createMenu(node, name);
                          }}
                        >
                          {name}
                        </div>
                      }
                      extra={runnerBtn(name, index)}
                    >
                      <Collapse
                        expandIconPosition="right"
                        expandIcon={({ isActive }) => (
                          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                        )}
                      >
                        {Object.keys(cheetahProject[name] || {}).map(
                          (dir: string, order: number) => (
                            <Panel
                              key={order}
                              header={
                                <div className="dir-name">
                                  <span>{dir}</span>
                                  <span className="sub">
                                    {
                                      Object.keys(cheetahProject[name][dir])
                                        .length
                                    }
                                  </span>
                                </div>
                              }
                            >
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

          {!noProject &&
            !noConfig && [
              <div className="form-item" key="default">
                <div className="label">基础命令选项</div>
                <div className="command-table">
                  {type === 'cheetah' && [
                    <div className="row" key="dev">
                      <div className="desc">
                        <Icon type="play-square" />
                        <span>运行选中工程目录</span>
                      </div>
                      <div className="control">
                        <Tooltip placement="left" title="运行选中目录">
                          <div
                            className="btn-default"
                            onClick={() => {
                              this.runBundleCmd(dev, this.checkedBundles);
                            }}
                          >
                            <i className="iconfont">&#xe603;</i>
                          </div>
                        </Tooltip>
                      </div>
                    </div>,
                    <div className="row" key="build">
                      <div className="desc">
                        <Icon type="file-zip" />
                        <span>打包选中工程目录</span>
                      </div>
                      <div className="control">
                        <Tooltip placement="left" title="打包选中目录">
                          <div
                            className="btn-default"
                            onClick={() => {
                              this.runBundleCmd(build, this.checkedBundles);
                            }}
                          >
                            <i className="iconfont">&#xe603;</i>
                          </div>
                        </Tooltip>
                      </div>
                    </div>,
                  ]}
                  <div className="row">
                    <div className="desc">
                      <Icon type="disconnect" />
                      <span>终止根目录全部命令</span>
                    </div>
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
                    </div>
                  </div>
                </div>
              </div>,
              <div className="form-item" key="custom">
                <div className="label">自定义命令选项</div>
                <div className="command-table">
                  {command &&
                    command.map((item: any, index: number) => (
                      <div className="row" key={index}>
                        <div className="desc">
                          <Icon type="code" />
                          <span>{item.name}</span>
                        </div>
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
              </div>,
            ]}
        </div>
      </div>
    );
  }
}

export default RunnerView;
