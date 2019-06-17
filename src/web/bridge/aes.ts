import RPC from './rpc';
const { dispatch } = RPC;

export const encode = (
  data: string,
  pswd: string,
  callback: (e: string) => void
): void => {
  dispatch('aes-encode', { data, pswd });
  RPC.once('get-aes-encode', (params: string) => {
    callback(params);
  });
};

export const decode = (
  data: string,
  pswd: string,
  callback: (e: string) => void
): void => {
  dispatch('aes-decode', { data, pswd });
  RPC.once('get-aes-decode', (params: string) => {
    callback(params);
  });
};

export const encodeSync = (data: string, pswd: string) =>
  new Promise((resolve, reject) => {
    encode(data, pswd, (params: string) => {
      resolve(params);
    });
  });

export const decodeSync = (data: string, pswd: string) =>
  new Promise((resolve, reject) => {
    decode(data, pswd, (params: string) => {
      resolve(params);
    });
  });
