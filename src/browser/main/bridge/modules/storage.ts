import RPC from '../rpc';
const { dispatch } = RPC;

export const write = (key: string, data: any): void => {
  dispatch('write-storage', { key, data });
};

export const read = (key: string, cb: (args: any) => void): void => {
  dispatch('read-storage', key);
  RPC.once('get-storage' + key, (data: any) => {
    cb(data);
  });
};

export const remove = (key: string): void => {
  dispatch('remove-storage', key);
};

export const readSync = (key: string) =>
  new Promise((resolve) => {
    read(key, (args: any) => {
      resolve(args);
    });
  });
