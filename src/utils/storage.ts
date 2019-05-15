import { ipcRenderer } from 'electron';

export const write = (key: string, data: object): void => {
  ipcRenderer.send('write-storage', key, data);
};

export const read = (key: string, cb: (args: object) => void): void => {
  ipcRenderer.send('read-storage', key);
  ipcRenderer.once('get-storage', (event: any, data: object) => {
    cb(data);
  });
};

export const remove = (key: string): void => {
  ipcRenderer.send('remove-storage', key);
};
