import { remote } from 'electron';
import * as path from 'path';
const { app, dialog, getCurrentWindow } = remote;
const win = getCurrentWindow();

import RPC from '../rpc';
const { dispatch } = RPC;

export const setSaveAs = (
  fileName: string,
  afterFn: (e: string) => void
): void => {
  dialog
    .showSaveDialog(win, {
      defaultPath: path.join(app.getPath('documents'), fileName),
    })
    .then(({ filePath }: any) => {
      // console.log(filePath);
      if (filePath) {
        afterFn(filePath);
      }
    });
};

export const selectFile = (
  args: any,
  cb: (e: string[] | undefined) => void
): void => {
  dialog
    .showOpenDialog(win, {
      defaultPath: app.getPath('documents'),
      ...args,
    })
    .then(({ canceled, filePaths }: any) => {
      if (!canceled) {
        cb(filePaths);
      }
    });
};

export const readTxtByLine = (filePath: string, readFn: (e: any) => void) => {
  dispatch('read-text', filePath);
  RPC.on('get-text-line', (params: any) => {
    readFn(params);
    if (params.status === 'done') {
      RPC.removeListener('get-text-line', () => void 0);
    }
  });
};

export const removeFile = (filePath: string) => {
  dispatch('remove-file', filePath);
};

export const cleanAppCache = (cb?: (e: any) => void) => {
  dispatch('clean-app-cache', {});
  RPC.once('clean-app-cache-done', (args: any) => {
    cb && cb(args);
  });
};

export const cleanAppData = (cb?: (e: any) => void) => {
  dispatch('clean-app-data', {});
  RPC.once('clean-app-data-done', (args: any) => {
    cb && cb(args);
  });
};

export const readJsonFile = (key: string, cb: (args: any) => void): void => {
  dispatch('read-local-json', key);
  RPC.once('read-local-json-done', (data: any) => {
    cb(data);
  });
};

export const readJsonFileSync = (key: string) =>
  new Promise((resolve) => {
    readJsonFile(key, (args: any) => {
      resolve(args);
    });
  });
