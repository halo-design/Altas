import { ipcRenderer } from 'electron';

export const spawn = (
  command: string,
  callback?: (e: string) => void
): void => {
  ipcRenderer.send('spawn', command);
  ipcRenderer.removeAllListeners('stdout');
  ipcRenderer.on('stdout', (event: any, params: string) => {
    if (callback) {
      callback(params);
    }
  });
};

export const spawnKill = () => {
  ipcRenderer.send('spawn-kill');
};
