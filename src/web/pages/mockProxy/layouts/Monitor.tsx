import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Logger from './Logger';

@inject((stores: any) => {
  const { serverOnline, websocketOnline, host } = stores.monitor;
  return {
    serverOnline,
    websocketOnline,
    host,
    createServer: (port?: number) => stores.monitor.createServer(port),
    disposeServer: () => stores.monitor.disposeServer(),
  };
})
@observer
class MonitorView extends React.Component<any> {
  public render() {
    const {
      serverOnline,
      websocketOnline,
      createServer,
      disposeServer,
      host,
    } = this.props;

    return (
      <div className="app-monitor">
        <Logger />
        <div className="app-status-bar">
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
            {serverOnline && websocketOnline ? (
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
              <span>启动代理调试</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MonitorView;
