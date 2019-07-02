import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { reaction, observable, action } from 'mobx';
const QRcode = require('qrcode');

@inject((stores: any) => {
  const { focusWebviewUrl, showLinkBar } = stores.webview;

  return {
    focusWebviewUrl,
    showLinkBar,
    replaceWebview: (url: string) => stores.webview.replaceWebview(url),
  };
})
@observer
class FooterView extends React.Component<any, any> {
  public ipt: any = null;
  public canvas: any = null;
  public currentUrl: string = '';
  @observable public showQRcode: boolean = false;

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
        this.currentUrl || this.props.focusWebviewUrl,
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

  public componentDidMount() {
    this.currentUrl = this.props.focusWebviewUrl;
    reaction(
      () => this.props.focusWebviewUrl,
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
              onChange={(e: any) => {
                this.setCurrentUrl(e.target.value);
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
