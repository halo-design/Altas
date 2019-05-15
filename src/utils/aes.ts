import { ipcRenderer } from 'electron';

export const encode = (
  data: string,
  pswd: string,
  callback: (e: string) => void
): void => {
  ipcRenderer.send('aes-encode', { data, pswd });
  ipcRenderer.once('get-aes-encode', (event: any, params: string) => {
    callback(params);
  });
};

export const decode = (
  data: string,
  pswd: string,
  callback: (e: string) => void
): void => {
  ipcRenderer.send('aes-decode', { data, pswd });
  ipcRenderer.once('get-aes-decode', (event: any, params: string) => {
    callback(params);
  });
};
