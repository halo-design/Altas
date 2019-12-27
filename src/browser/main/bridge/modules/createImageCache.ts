import RPC from '../rpc';
const { dispatch } = RPC;

interface ICreateImageCache {
  url: string;
  thumbType: string;
  saveName: string;
  width: number;
  height: number;
}

export const createCache = (params: ICreateImageCache, cb?: Function): void => {
  dispatch('create-image-cache', params);
  RPC.once('image-cache-created', (args: any) => {
    cb && cb(args);
  });
};
