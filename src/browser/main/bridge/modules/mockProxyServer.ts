import RPC from '../rpc';
const { dispatch } = RPC;

export const createMockProxyServer = (port: number) => {
  dispatch('create-mock-proxy-server', { port });
};

export const disposeMockProxyServer = () => {
  dispatch('dispose-mock-proxy-server', '');
};

export const addMockProxyServerListener = (
  callback: (connectStatus: boolean, params: any) => void
) => {
  RPC.on('mock-proxy-server-connect', (args: any) => {
    callback(true, args);
  });
  RPC.on('mock-proxy-server-disconnected', (args: any) => {
    callback(false, args);
  });
};

export const addMockProxyWsListener = (
  callback: (connectStatus: boolean, params: any) => void
) => {
  RPC.on('mock-proxy-ws-connect', (args: any) => {
    callback(true, args);
  });
  RPC.on('mock-proxy-ws-disconnected', (args: any) => {
    callback(false, args);
  });
};

export const addClientWsListener = (callback: (e: any) => void) => {
  RPC.mockProxyWsRecieveGlobal(callback);
};

export const sendWsToClient = (params: any) => {
  RPC.mockProxyWsBrodcastGlobal(params);
};

export const mockProxyWsSendGlobal = (callback: (e: any) => void) => {
  RPC.on('mock-proxy-ws-send-global', (args: any) => {
    callback(args);
  });
};
