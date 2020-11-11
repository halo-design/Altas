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

export const getAppDir = (cb: (args: any) => void): void => {
  dispatch('get-appdir', '');
  RPC.once('appdir', (args: any) => {
    cb(args);
  });
};

export const getAppDirSync = () =>
  new Promise((resolve) => {
    getAppDir((params: any) => {
      resolve(params);
    });
  });

export const getIpAddress = (cb: (args: any) => void): void => {
  dispatch('get-ip-address', '');
  RPC.once('ip-address', (args: any) => {
    cb(args);
  });
};

export const getIpAddressSync = () =>
  new Promise((resolve) => {
    getIpAddress((params: any) => {
      resolve(params);
    });
  });

export const getDeviceOS = (cb: (args: any) => void): void => {
  dispatch('get-device-os', '');
  RPC.once('device-os', (args: any) => {
    cb(args);
  });
};

export const getDeviceStatus = (cb: (args: any) => void): void => {
  dispatch('get-device-status', '');
  RPC.once('device-status', (args: any) => {
    cb(args);
  });
};

export const getDeviceOSSync = () =>
  new Promise((resolve) => {
    getDeviceOS((params: any) => {
      resolve(params);
    });
  });

export const openLink = (url: string): void => {
  shell.openExternal(url);
};

export const getProcessPid = (
  dirname: string,
  cb: (args: any) => void
): void => {
  dispatch('detect-process-pid', { dirname });
  RPC.once('get-process-pid', (args: any) => {
    cb(args);
  });
};

export const getWindow = () => getCurrentWindow();
