import * as React from 'react';
import RPC from '../../../main/bridge/rpc';

class MonitorView extends React.Component<any> {
  public createProxyDebug() {
    RPC.dispatch('create-mock-proxy-server', { port: 8282 });
  }

  public disposeProxyServer() {
    RPC.dispatch('dispose-mock-proxy-server', '');
  }

  public sendToProxyPage() {
    RPC.wsBrodcastGlobal({
      mes: 'amazing',
    });
  }

  public componentDidMount() {
    RPC.on('mock-proxy-server-connect', (args: any) => {
      console.log(args, 'mock-proxy-server-connect');
    });
    RPC.on('mock-proxy-server-disconnected', (args: any) => {
      console.log(args, 'mock-proxy-server-disconnected');
    });

    RPC.on('mock-proxy-ws-connect', (args: any) => {
      console.log(args, 'mock-proxy-ws-connect');
    });
    RPC.on('mock-proxy-ws-disconnected', (args: any) => {
      console.log(args, 'mock-proxy-ws-disconnected');
    });

    RPC.wsRecieveGlobal((args: any) => {
      console.log(args);
    });
  }

  public render() {
    return (
      <div className="app-monitor">
        <button
          onClick={() => {
            this.createProxyDebug();
          }}
        >
          启动代理调试
        </button>
        <button
          onClick={() => {
            this.disposeProxyServer();
          }}
        >
          关闭代理调试
        </button>
        <button
          onClick={() => {
            this.sendToProxyPage();
          }}
        >
          向代理页面发送消息
        </button>
      </div>
    );
  }
}

export default MonitorView;
