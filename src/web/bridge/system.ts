import { remote } from 'electron';
const { shell, getCurrentWindow } = remote;

import RPC from './rpc';
const { dispatch } = RPC;

RPC.on('history-push', (path: string): void => {
  location.href = `#${path}`;
});

export const setTrayTitle = (title: string): void => {
  dispatch('set-tray-title', title);
};

export const getAppDir = (cb: (args: object) => void): void => {
  dispatch('get-appdir', '');
  RPC.once('appdir', (args: object) => {
    cb(args);
  });
};

export const getAppDirSync = () =>
  new Promise((resolve, reject) => {
    getAppDir((params: object) => {
      resolve(params);
    });
  });

export const getIpAddress = (cb: (args: object) => void): void => {
  dispatch('get-ip-address', '');
  RPC.once('ip-address', (args: object) => {
    cb(args);
  });
};

export const getIpAddressSync = () =>
  new Promise((resolve, reject) => {
    getIpAddress((params: object) => {
      resolve(params);
    });
  });

export const getDeviceOS = (cb: (args: object) => void): void => {
  dispatch('get-device-os', '');
  RPC.once('device-os', (args: object) => {
    cb(args);
  });
};

export const getDeviceOSSync = () =>
  new Promise((resolve, reject) => {
    getDeviceOS((params: object) => {
      resolve(params);
    });
  });

export const openLink = (url: string): void => {
  shell.openExternal(url);
};

export const getProcessPid = (
  dirname: string,
  cb: (args: object) => void
): void => {
  dispatch('detect-process-pid', { dirname });
  RPC.once('get-process-pid', (args: object) => {
    cb(args);
  });
};

export const getWindow = () => getCurrentWindow();
