import RPC from './rpc';
const { dispatch } = RPC;

export const create = (data: object): void => {
  dispatch('create-project', data);
};
