import RPC from './rpc';
const { dispatch } = RPC;

export const isMac = process.platform === 'darwin';
export const isDev = process.env.NODE_ENV === 'development';
export const isWin = process.platform === 'win32';

export const detectSupportEnv = (callback: Function): void => {
  dispatch('detect-support-env', {});
  RPC.once('get-support-env', (params: string) => {
    callback(params);
  });
};

export const getAppInfo = (callback: Function): void => {
  dispatch('read-app-info', {});
  RPC.once('get-app-info', (params: string) => {
    callback(params);
  });
};
