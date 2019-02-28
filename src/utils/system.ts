import { ipcRenderer, remote } from 'electron';
const { shell } = remote;
import { history } from 'react-router-util';

ipcRenderer.on('history-push', (event: any, path: string): void => {
  history.push(path);
})

export const setTrayTitle = (title: string): void => {
  ipcRenderer.send('set-tray-title', title);
}

export const detect = (
  cb: (args: object) => void
): void => {
  ipcRenderer.send('ipc-start');
  ipcRenderer.once('ipc-running', (event: any, args: object) => {
    cb(args);
  });
}

export const getAppDir = (
  cb: (args: string) => void
): void => {
  ipcRenderer.send('get-appdir');
  ipcRenderer.once('appdir', (event: any, args: string) => {
    cb(args);
  });
}

export const getIpAddress = (
  cb: (args: object) => void
): void => {
  ipcRenderer.send('get-ip-address');
  ipcRenderer.once('ip-address', (event : any, args: object) => {
    cb(args);
  });
}

export const getDeviceOS = (
  cb: (args: object) => void
): void => {
  ipcRenderer.send('get-device-os');
  ipcRenderer.once('device-os', (event : any, args: object) => {
    cb(args);
  });
}

export const openLink = (url: string): void => {
  shell.openExternal(url);
}
