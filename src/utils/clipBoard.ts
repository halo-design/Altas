import RPC from './rpc';
const { dispatch } = RPC;

export const read = (cb: (args: string) => void): void => {
  dispatch('read-clipboard', '');
  RPC.once('get-clipboard-text', (args: string) => {
    cb(args);
  });
};

export const write = (txt: string) => {
  dispatch('write-clipboard', txt);
};
