import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { DeviceContext } from '../context';
import { mockSetter } from '../../../main/bridge/createWindow';

@inject((stores: any) => {
  const {
    focusOnFisrt,
    focusOnLast,
    webviewCount,
    focusDevtoolsState,
    showLinkBar,
    focusWebviewSpinner,
  } = stores.webview;

  return {
    focusOnFisrt,
    focusOnLast,
    webviewCount,
    focusDevtoolsState,
    showLinkBar,
    focusWebviewSpinner,
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
    } = this.props;

    return (
      <div className="app-header">
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
            className="btn"
            onClick={() => {
              mockSetter();
            }}
          >
            &#xe738;
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
