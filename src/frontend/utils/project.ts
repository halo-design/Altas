import RPC from './rpc';
const { dispatch } = RPC;

export const create = (data: object, cb: Function): void => {
  dispatch('create-project', data);

  const handle = (data: any) => {
    const { step, status } = data;
    cb(data);
    if ((step === 'unzip' && status === 'finished') || status === 'error') {
      RPC.removeListener('get-repo', handle);
    }
  };

  RPC.on('get-repo', handle);
};
