import RPC from '../rpc';
const { dispatch } = RPC;

export const createServer = (
  options: any,
  successFn?: (e: any) => void,
  errorFn?: (e: any) => void
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

export const serverMonitor = (cb: (e: any) => void) => {
  RPC.on('server-logger', (args: any) => {
    cb(args);
  });
};

export const disposeServer = (cb?: () => void) => {
  dispatch('close-server', {});
  RPC.once('server-closed', () => {
    cb && cb();
  });
};
