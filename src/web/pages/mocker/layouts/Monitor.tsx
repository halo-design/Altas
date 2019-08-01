import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Logger from './Logger';
import classNames from 'classnames';

@inject((stores: any) => {
  const { serverOnline, websocketOnline, host, qrCodeVisible } = stores.monitor;
  return {
    serverOnline,
    websocketOnline,
    host,
    qrCodeVisible,
    createServer: (port?: number) => stores.monitor.createServer(port),
    clearLog: () => stores.monitor.clearLog(),
    disposeServer: () => stores.monitor.disposeServer(),
    initQrcode: (el: any) => stores.monitor.initQrcode(el),
  };
})
@observer
class MonitorView extends React.Component<any> {
  public qrCanvas: any = null;

  public componentDidMount() {
    if (this.qrCanvas) {
      this.props.initQrcode(this.qrCanvas);
    }
  }

  public render() {
    const {
      serverOnline,
      websocketOnline,
      createServer,
      disposeServer,
      host,
      qrCodeVisible,
      clearLog,
    } = this.props;

    return (
      <div className="app-monitor">
        <Logger />
        <div
          className={classNames('app-link-qrcode', {
            hide: !qrCodeVisible,
            fadeInUp: qrCodeVisible,
          })}
        >
          <div className="qrcode-wrapper">
            <canvas
              width="240"
              height="240"
              ref={node => {
                this.qrCanvas = node;
              }}
            />
            <p className="notice">请打开猎豹App扫一扫进行连接</p>
          </div>
        </div>
        <div
          className={classNames('app-status-bar', {
            active: serverOnline,
          })}
        >
          <div
            className="clear-log"
            onClick={() => {
              clearLog();
            }}
          >
            <i className="iconfont">&#xe601;</i>
            <span>清除日志</span>
          </div>
          <div className="server">
            <i className="iconfont">&#xe624;</i>
            <span>代理服务：</span>
            {serverOnline ? (
              <span>
                <i className="light active" />
                已启动
              </span>
            ) : (
              <span>
                <i className="light" />
                等待启动
              </span>
            )}
          </div>
          <div className="ws">
            <i className="iconfont">&#xe63b;</i>
            <span>接管程序：</span>
            {websocketOnline ? (
              <span>
                <i className="light active" />
                已连接
              </span>
            ) : (
              <span>
                <i className="light" />
                等待连接
              </span>
            )}
          </div>
          <div className="host">
            {host &&
              serverOnline && [
                <i key="label" className="iconfont">
                  &#xe729;
                </i>,
                <span key="val">代理服务器：{host}</span>,
              ]}
          </div>
          {serverOnline ? (
            <div
              className="start-proxy-server-btn"
              onClick={() => {
                disposeServer();
              }}
            >
              <i className="iconfont">&#xe867;</i>
              <span>关闭代理调试</span>
            </div>
          ) : (
            <div
              className="start-proxy-server-btn"
              onClick={() => {
                createServer();
              }}
            >
              <i className="iconfont">&#xe603;</i>
              <span>启动接管调试</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MonitorView;
