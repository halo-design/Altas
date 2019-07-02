import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { DeviceContext } from '../context';

@inject((stores: any) => {
  const {
    webviewList,
    focusIndex,
    webviewCount,
    focusOnFisrt,
    focusOnLast,
    focusDevtoolsState,
    showLinkBar,
  } = stores.webview;

  return {
    webviewList,
    focusIndex,
    webviewCount,
    focusOnFisrt,
    focusOnLast,
    focusDevtoolsState,
    showLinkBar,
    createNewWebview: (url: string) => stores.webview.createNewWebview(url),
    focusToNextWebview: () => stores.webview.focusToNextWebview(),
    focusToPrevWebview: () => stores.webview.focusToPrevWebview(),
    debugFocusWebview: () => stores.webview.debugFocusWebview(),
    reloadFocusWebview: () => stores.webview.reloadFocusWebview(),
    toogleLinkBar: () => stores.webview.toogleLinkBar(),
    getWebviewDOM: (index: number, el: any, uid: string) =>
      stores.webview.getWebviewDOM(index, el, uid),
  };
})
@observer
class HeaderView extends React.Component<any, any> {
  static contextType = DeviceContext;

  public componentDidMount() {
    console.log(this.context);
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
    } = this.props;

    return (
      <div className="app-header">
        <div className="panel">
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
