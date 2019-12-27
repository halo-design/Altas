import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { DeviceContext } from '../context';
import { mockProxyServer } from '../../../main/bridge/modules/createWindow';
import CreateContextMenu from '../../../main/bridge/modules/CreateContextMenu';
import win from '../../../main/bridge/win';

@inject((stores: any) => {
  const {
    focusOnFisrt,
    focusOnLast,
    webviewCount,
    focusDevtoolsState,
    showLinkBar,
    focusWebviewSpinner,
    serverConnectState,
    wsConnectState,
    rpcSettingsVisible,
    loginShowState,
  } = stores.webview;

  return {
    focusOnFisrt,
    focusOnLast,
    webviewCount,
    focusDevtoolsState,
    showLinkBar,
    focusWebviewSpinner,
    serverConnectState,
    wsConnectState,
    rpcSettingsVisible,
    loginShowState,
    setRpcSettingsVisible: (state: boolean) =>
      stores.webview.setRpcSettingsVisible(state),
    setLogintState: (state: boolean) => stores.webview.setLogintState(state),
    focusToNextWebview: () => stores.webview.focusToNextWebview(),
    focusToPrevWebview: () => stores.webview.focusToPrevWebview(),
    debugFocusWebview: () => stores.webview.debugFocusWebview(),
    reloadFocusWebview: () => stores.webview.reloadFocusWebview(),
    toogleLinkBar: () => stores.webview.toogleLinkBar(),
  };
})
@observer
class HeaderView extends React.Component<any, any> {
  static contextType = DeviceContext;
  private headerEl: HTMLElement | null = null;

  componentDidMount() {
    if (this.headerEl) {
      const opts: any = [
        {
          click: (e: any) => {
            win.minimize();
          },
          label: '最小化窗口',
        },
        {
          type: 'separator',
        },
        {
          click: () => {
            win.setAlwaysOnTop(true);
          },
          label: '窗口置顶',
        },
        {
          type: 'separator',
        },
        {
          click: () => {
            win.setAlwaysOnTop(false);
          },
          label: '取消窗口置顶',
        },
      ];
      new CreateContextMenu(this.headerEl, opts);
    }
  }

  public render() {
    const { currentWindow } = this.context;
    const {
      focusOnFisrt,
      focusOnLast,
      focusToNextWebview,
      focusToPrevWebview,
      debugFocusWebview,
      focusDevtoolsState,
      reloadFocusWebview,
      showLinkBar,
      toogleLinkBar,
      focusWebviewSpinner,
      webviewCount,
      serverConnectState,
      wsConnectState,
      rpcSettingsVisible,
      loginShowState,
      setRpcSettingsVisible,
      setLogintState,
    } = this.props;

    return (
      <div
        className="app-header"
        ref={node => {
          this.headerEl = node;
        }}
      >
        <div className="panel">
          <div
            className={classnames('spinner', {
              hide: !focusWebviewSpinner,
            })}
          >
            <svg className="circular" viewBox="25 25 50 50">
              <circle
                className="path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                strokeWidth="2"
                strokeMiterlimit="10"
              />
            </svg>
          </div>
          <div
            className={classnames('btn', {
              disabled: focusOnFisrt || webviewCount === 0,
            })}
            title="点击后退"
            onClick={() => {
              focusToPrevWebview();
            }}
          >
            &#xe7ef;
          </div>
          <div
            className={classnames('btn', {
              disabled: focusOnLast || webviewCount === 0,
            })}
            title="点击前进"
            onClick={() => {
              focusToNextWebview();
            }}
          >
            &#xe7ee;
          </div>
          <div
            title="显示当前链接"
            className={classnames('btn', {
              active: showLinkBar,
            })}
            onClick={() => {
              toogleLinkBar();
            }}
          >
            &#xe7e2;
          </div>
          <div
            title="重载当前页面"
            className={classnames('btn', {
              disabled: webviewCount === 0,
            })}
            onClick={() => {
              reloadFocusWebview();
            }}
          >
            &#xe788;
          </div>
          <div
            title="切换开发者工具"
            className={classnames('btn', {
              active: focusDevtoolsState,
              disabled: webviewCount === 0,
            })}
            onClick={() => {
              debugFocusWebview();
            }}
          >
            &#xe8e8;
          </div>
          <div
            title="模拟参数"
            className={classnames('btn', {
              active: serverConnectState,
              light: wsConnectState,
            })}
            onClick={() => {
              mockProxyServer();
            }}
          >
            &#xe738;
          </div>
          <div className="panel-wrap">
            <div
              title="设置RPC和登录参数"
              className={classnames('btn', {
                active: rpcSettingsVisible,
              })}
              onClick={() => {
                setRpcSettingsVisible(!rpcSettingsVisible);
              }}
            >
              &#xe78e;
            </div>
            <div
              title="登录"
              className={classnames('btn', {
                active: loginShowState,
              })}
              onClick={() => {
                setLogintState(!loginShowState);
              }}
            >
              &#xe8ef;
            </div>
          </div>
          <div
            title="关闭调试器"
            className="btn"
            onClick={() => {
              currentWindow.close();
            }}
          >
            &#xe7fc;
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderView;
