import RPC from './rpc';
const { dispatch } = RPC;

export const createWindow = (
  entry: object | string,
  options: object,
  callback: Function
): void => {
  dispatch('create-window', { entry, options });
  RPC.once('get-window-id', (params: { win_uid: string }) => {
    callback(params);
  });
};

export const closeWindow = (uid: string): void => {
  dispatch('close-window', { uid });
};

export const openDeviceDebug = (target: string, callback: Function) => {
  createWindow(
    {
      pathname: 'renderer/device.html',
      hash: target,
    },
    {
      width: 414,
      height: 736,
      resizable: true,
      movable: true,
      maximizable: false,
      minimizable: false,
      transparent: false,
      backgroundColor: '#fff',
      titleBarStyle: 'hiddenInset',
    },
    callback
  );
};
