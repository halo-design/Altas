import RPC from './rpc';
const { dispatch } = RPC;

export const createServer = (
  options: any,
  successFn?: Function,
  errorFn?: Function
) => {
  dispatch('create-server', {
    options,
  });

  RPC.once('server-started', (args: any) => {
    successFn && successFn(args);
  });

  RPC.once('server-error', (args: any) => {
    errorFn && errorFn(args);
  });
};

export const serverMonitor = (cb: Function) => {
  RPC.on('server-logger', (args: any) => {
    cb(args);
  });
};

export const disposeServer = (cb?: Function) => {
  dispatch('close-server', {});
  RPC.once('server-closed', () => {
    cb && cb();
  });
};
