import * as React from 'react';
import {
  createMockProxyServer,
  disposeMockProxyServer,
  addMockProxyServerListener,
  addMockProxyWsListener,
  addClientWsListener,
  sendWsToClient,
} from '../../../main/bridge/mockProxyServer';

class MonitorView extends React.Component<any> {
  public componentDidMount() {
    addMockProxyServerListener((status: any, args: any) => {
      console.log('server:', status, args);
    });

    addMockProxyWsListener((status: any, args: any) => {
      console.log('ws:', status, args);
    });

    addClientWsListener((args: any) => {
      console.log('wsData:', args);
    });
  }

  public render() {
    return (
      <div className="app-monitor">
        <button
          onClick={() => {
            createMockProxyServer(8282);
          }}
        >
          启动代理调试
        </button>
        <button
          onClick={() => {
            disposeMockProxyServer();
          }}
        >
          关闭代理调试
        </button>
        <button
          onClick={() => {
            sendWsToClient({ info: 'button test click' });
          }}
        >
          向代理页面发送消息
        </button>
      </div>
    );
  }
}

export default MonitorView;
