import { remote } from 'electron';
const { shell } = remote;

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

export const getIpAddress = (cb: (args: object) => void): void => {
  dispatch('get-ip-address', '');
  RPC.once('ip-address', (args: object) => {
    cb(args);
  });
};

export const getDeviceOS = (cb: (args: object) => void): void => {
  dispatch('get-device-os', '');
  RPC.once('device-os', (args: object) => {
    cb(args);
  });
};

export const openLink = (url: string): void => {
  shell.openExternal(url);
};
