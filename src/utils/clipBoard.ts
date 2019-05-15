import { ipcRenderer } from 'electron';

export const read = (cb: (args: string) => void): void => {
  ipcRenderer.send('read-clipboard');
  ipcRenderer.once('get-clipboard-text', (event: any, args: string) => {
    cb(args);
  });
};

export const write = (txt: string) => {
  ipcRenderer.send('write-clipboard', txt);
};
