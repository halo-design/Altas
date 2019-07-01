import * as React from 'react';
import { DeviceContext } from '../context';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

@inject((stores: any) => {
  const { webviewList, focusIndex, webviewCount } = stores.webview;

  return {
    webviewList,
    focusIndex,
    webviewCount,
    createNewWebview: (url: string, params: object) =>
      stores.webview.createNewWebview(url, params),
    clearAllThenCreateNewWebview: (url: string) =>
      stores.webview.clearAllThenCreateNewWebview(url),
    getWebviewDOM: (index: number, el: any, uid: string) =>
      stores.webview.getWebviewDOM(index, el, uid),
  };
})
@observer
class WebviewView extends React.Component<any, any> {
  static contextType = DeviceContext;
  public webview: any = null;

  public componentDidMount() {
    const { target } = this.context;

    this.props.createNewWebview(target);

    setTimeout(() => {
      this.props.clearAllThenCreateNewWebview('https://gitee.com/');
    }, 3000);

    setTimeout(() => {
      this.props.createNewWebview('https://www.baidu.com/', {
        author: 'aford',
        id: 100342,
        isMarried: true,
        times: [1, 2, 3, 4],
      });
    }, 6000);
  }

  public render() {
    const {
      descriptors: {
        viewport: { width, height },
      },
    } = this.context;

    const wvSize = {
      width: width + 'px',
      height: height - 80 + 'px',
    };

    const { webviewCount, webviewList, getWebviewDOM, focusIndex } = this.props;

    return (
      <div className="app-webview" style={wvSize}>
        <div
          className="app-webview-wrapper"
          style={{
            width: `${webviewCount * 100}vw`,
            transform: `translateX(-${focusIndex * 100}vw)`,
          }}
        >
          {webviewList.map((item: any, index: number) => {
            return (
              <webview
                {...toJS(item.attr)}
                key={item.uid}
                ref={node => {
                  getWebviewDOM(index, node, item.uid);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default WebviewView;
