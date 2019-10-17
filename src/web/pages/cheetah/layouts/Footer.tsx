import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { reaction, observable, action, computed } from 'mobx';
import { readText } from '../../../main/bridge/modules/clipBoard';
import Toast from 'antd-mobile/lib/toast';
import * as url from 'url';

const QRcode = require('qrcode');

@inject((stores: any) => {
  const { focusWebviewUrl, showLinkBar, testUrl } = stores.webview;

  return {
    focusWebviewUrl,
    showLinkBar,
    testUrl,
    replaceWebview: (url: string) => stores.webview.replaceWebview(url),
  };
})
@observer
class FooterView extends React.Component<any, any> {
  public ipt: any = null;
  public canvas: any = null;
  public currentUrl: string = '';
  @observable public showQRcode: boolean = false;

  @computed get focusWebviewCleanUrl() {
    const { host, protocol, pathname } = url.parse(this.props.focusWebviewUrl);
    return url.format({ host, protocol, pathname });
  }

  @action
  public setQRcodeVisible(state: boolean) {
    this.showQRcode = state;
  }

  public genQrcode() {
    if (this.showQRcode) {
      this.setQRcodeVisible(false);
    } else if (this.canvas) {
      QRcode.toCanvas(
        this.canvas,
        this.currentUrl || this.focusWebviewCleanUrl,
        {
          width: 180,
          margin: 0,
        }
      ).then(() => {
        this.setQRcodeVisible(true);
      });
    }
  }

  public setCurrentUrl(url: string) {
    this.currentUrl = url;
  }

  public pasteUrl(e: any) {
    readText((url: string) => {
      if (url === this.currentUrl || !this.props.testUrl(url)) {
        return;
      }
      e.target.value = url;
      this.currentUrl = url;
      Toast.info('已粘贴文本内容！');
    });
  }

  public componentDidMount() {
    this.currentUrl = this.focusWebviewCleanUrl;
    reaction(
      () => this.focusWebviewCleanUrl,
      (url: string) => {
        this.setQRcodeVisible(false);
        this.ipt.value = url;
      }
    );
  }

  public render() {
    return (
      <div
        className="app-footer"
        onClick={(e: any) => {
          this.setQRcodeVisible(false);
          e.stopPropagation();
        }}
      >
        <div
          className={classnames('portal', {
            show: this.showQRcode || this.props.showLinkBar,
          })}
        >
          <div
            className={classnames('btn', {
              active: this.showQRcode,
            })}
            onClick={() => {
              this.genQrcode();
            }}
          >
            &#xe7dd;
          </div>
          <div className="ipt">
            <input
              type="text"
              defaultValue=""
              ref={node => {
                this.ipt = node;
              }}
              onFocus={(e: any) => {
                this.pasteUrl(e);
              }}
              onChange={(e: any) => {
                this.setCurrentUrl(e.target.value);
              }}
              onKeyUp={(ev: any) => {
                if (ev.keyCode === 13) {
                  this.props.replaceWebview(this.currentUrl);
                }
              }}
            />
          </div>
          <div
            className="btn"
            onClick={() => {
              this.props.replaceWebview(this.currentUrl);
            }}
          >
            &#xe7ee;
          </div>
        </div>
        <div
          className={classnames('qrcode', {
            show: this.showQRcode,
          })}
        >
          <canvas
            width="180"
            height="180"
            ref={node => {
              this.canvas = node;
            }}
          />
        </div>
      </div>
    );
  }
}

export default FooterView;
