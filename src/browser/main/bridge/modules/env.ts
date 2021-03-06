import RPC from '../rpc';
const { dispatch } = RPC;

export const isMac = process.platform === 'darwin';
export const isDev = process.env.NODE_ENV === 'development';
export const isWin = process.platform === 'win32';

export const detectSupportEnv = (callback: (e: any) => void): void => {
  dispatch('detect-support-env', {});
  RPC.once('get-support-env', (params: string) => {
    callback(params);
  });
};
