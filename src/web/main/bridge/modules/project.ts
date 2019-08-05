import RPC from '../rpc';
const { dispatch } = RPC;

export const create = (data: object, cb: Function, errFn?: Function): void => {
  dispatch('create-project', data);

  const handle = (data: any) => {
    const { step, status } = data;
    cb(data);

    if (status === 'error') {
      errFn && errFn(data.state.errorText);
    }

    if ((step === 'unzip' && status === 'finished') || status === 'error') {
      RPC.removeListener('get-repo', handle);
    }
  };

  RPC.on('get-repo', handle);
};

export const getProjectRunnerConfig = (
  projectPath: string,
  cb: Function
): void => {
  dispatch('detect-runner-config', { projectPath });

  RPC.once('get-runner-config', (data: object) => {
    cb(data);
  });
};
