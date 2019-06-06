import RPC from './rpc';
const { dispatch } = RPC;

export const create = (data: object, cb: Function): void => {
  dispatch('create-project', data);
  RPC.on('get-repo', (data: object) => {
    cb(data);
  });
};
