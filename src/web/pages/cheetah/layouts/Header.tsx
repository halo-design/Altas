import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { DeviceContext } from '../context';

@inject((stores: any) => {
  const {
    focusOnFisrt,
    focusOnLast,
    focusDevtoolsState,
    showLinkBar,
    focusWebviewSpinner,
  } = stores.webview;

  return {
    focusOnFisrt,
    focusOnLast,
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
              disabled: focusOnFisrt,
            })}
            onClick={() => {
              focusToPrevWebview();
            }}
          >
            &#xe7ef;
          </div>
          <div
            className={classnames('btn', {
              disabled: focusOnLast,
            })}
            onClick={() => {
              focusToNextWebview();
            }}
          >
            &#xe7ee;
          </div>
          <div
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
            className="btn"
            onClick={() => {
              reloadFocusWebview();
            }}
          >
            &#xe788;
          </div>
          <div
            className={classnames('btn', {
              active: focusDevtoolsState,
            })}
            onClick={() => {
              debugFocusWebview();
            }}
          >
            &#xe8e8;
          </div>
          <div
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
