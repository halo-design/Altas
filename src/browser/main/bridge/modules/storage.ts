import RPC from '../rpc';
const { dispatch } = RPC;

export const write = (key: string, data: object): void => {
  dispatch('write-storage', { key, data });
};

export const read = (key: string, cb: (args: object) => void): void => {
  dispatch('read-storage', key);
  RPC.once('get-storage' + key, (data: object) => {
    cb(data);
  });
};

export const remove = (key: string): void => {
  dispatch('remove-storage', key);
};

export const readSync = (key: string) =>
  new Promise((resolve, reject) => {
    read(key, (args: object) => {
      resolve(args);
    });
  });
