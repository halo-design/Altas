import RPC from './rpc';
const { dispatch } = RPC;

export const spawn = (
  command: string,
  callback?: (e: string) => void
): void => {
  dispatch('spawn', command);
  RPC.removeAllListeners();
  RPC.on('stdout', (params: string) => {
    if (callback) {
      callback(params);
    }
  });
};

export const spawnKill = () => {
  dispatch('spawn-kill', '');
};
