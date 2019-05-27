import RPC from './rpc';
const { dispatch } = RPC;

export const spawn = (
  command: string,
  callback?: (e: string) => void
): void => {
  dispatch('spawn', command);
  RPC.removeListener('stdout', () => {
    console.warn('已停止监听终端输出！');
  });
  RPC.on('stdout', (params: string) => {
    if (callback) {
      callback(params);
    }
  });
};

export const spawnKill = () => {
  dispatch('spawn-kill', '');
};
