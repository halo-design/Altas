import { ipcRenderer } from 'electron';

export const commander = (command: string): void => {
  ipcRenderer.send('commander', command);
};

export const bindReadStdout = (callback: (e: string) => void): void => {
  ipcRenderer.send('bind-read-stdout');
  ipcRenderer.on('stdout', (event: any, params: string) => {
    callback(params);
  });
};

export const unbindReadStdout = () => {
  ipcRenderer.send('unbind-read-stdout');
};
