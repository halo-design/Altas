import * as React from 'react';
import { DeviceContext } from '../context';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import DatePicker from 'antd-mobile/lib/date-picker';

@inject((stores: any) => {
  const {
    webviewList,
    focusIndex,
    webviewCount,
    behavior,
    datepickerParams,
  } = stores.webview;

  return {
    webviewList,
    focusIndex,
    webviewCount,
    behavior,
    datepickerParams,
    createNewWebview: (url: string, params: object) =>
      stores.webview.createNewWebview(url, params),
    getWebviewDOM: (index: number, el: any, uid: string) =>
      stores.webview.getWebviewDOM(index, el, uid),
    initDatePicker: (el: any) => stores.webview.initDatePicker(el),
  };
})
@observer
class WebviewView extends React.Component<any, any> {
  static contextType = DeviceContext;
  public webview: any = null;
  public datepickerEl: any = null;

  public componentDidMount() {
    const { target } = this.context;
    this.props.createNewWebview(target);
    this.props.initDatePicker(this.datepickerEl);
    // setTimeout(() => {
    //   this.props.createNewWebview('http://i.jandan.net/qa');
    // }, 1000);
    // setTimeout(() => {
    //   this.props.createNewWebview('/treehole');
    // }, 2000);
    // setTimeout(() => {
    //   this.props.createNewWebview('/ooxx');
    // }, 3000);
    // setTimeout(() => {
    //   this.props.createNewWebview('/zoo');
    // }, 4000);
  }

  public render() {
    const {
      descriptors: {
        viewport: { width, height },
      },
    } = this.context;

    const wvSize = {
      width: width + 'px',
      height: height - 40 + 'px',
    };

    const {
      webviewCount,
      webviewList,
      getWebviewDOM,
      focusIndex,
      behavior,
      datepickerParams,
    } = this.props;

    let trans: any = {
      width: `${webviewCount * 100}vw`,
      transform: `translateX(-${focusIndex * 100}vw)`,
    };

    if (webviewCount <= 1 || /replace|clear/.test(behavior)) {
      trans.transitionProperty = 'none';
    }

    return (
      <div className="app-webview" style={wvSize}>
        <div className="app-webview-wrapper" style={trans}>
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
        <div className="hidden-element">
          <DatePicker {...datepickerParams}>
            <span
              ref={node => {
                this.datepickerEl = node;
              }}
            >
              datepicker
            </span>
          </DatePicker>
        </div>
      </div>
    );
  }
}

export default WebviewView;
