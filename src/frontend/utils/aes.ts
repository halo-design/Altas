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
