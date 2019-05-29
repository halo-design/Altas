import RPC from './rpc';
const { dispatch } = RPC;

export const createWindow = (
  entry: object,
  options: object,
  callback: (e: { win_uid: string }) => void
): void => {
  dispatch('create-window', { entry, options });
  RPC.once('get-window-id', (params: { win_uid: string }) => {
    callback(params);
  });
};

export const closeWindow = (uid: string): void => {
  dispatch('close-window', { uid });
};
