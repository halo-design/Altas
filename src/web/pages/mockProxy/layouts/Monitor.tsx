import * as React from 'react';
import RPC from '../../../main/bridge/rpc';

class MonitorView extends React.Component<any> {
  public createProxyDebug() {
    RPC.dispatch('create-mock-proxy-server', { port: 8282 });
    RPC.on('mock-proxy-server-connect', (args: any) => {
      console.log(args);
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

  public sendToProxyPage() {
    RPC.wsBrodcastGlobal({
      mes: 'amazing',
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
