import RPC from './rpc';
import * as qs from 'qs';
import { isMac } from './env';
const { dispatch } = RPC;

export const createWindow = (
  entry: object | string,
  options: object,
  callback?: Function
): void => {
  dispatch('create-window', { entry, options });
  RPC.once('get-window-id', (params: { win_uid: string }) => {
    callback && callback(params);
  });
};

export const closeWindow = (uid: string): void => {
  dispatch('close-window', { uid });
};

interface Idebug {
  target: string;
  width: number;
  height: number;
  useragent?: string;
  preload?: string;
}

export const openDeviceDebug = (options: Idebug, callback?: Function) => {
  const { width, height } = options;
  createWindow(
    {
      pathname: 'renderer/debug-mobile.html',
      hash: qs.stringify(options),
    },
    {
      width,
      height,
      resizable: false,
      movable: true,
      maximizable: false,
      minimizable: false,
      transparent: false,
      backgroundColor: '#fff',
      titleBarStyle: isMac ? 'customButtonsOnHover' : 'hidden',
    },
    callback
  );
};
