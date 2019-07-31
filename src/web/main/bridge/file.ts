import { remote } from 'electron';
import * as path from 'path';
const { app, dialog, getCurrentWindow } = remote;

import RPC from './rpc';
const { dispatch } = RPC;

export const setSaveAs = (
  fileName: string,
  afterFn: (e: string) => void
): void => {
  dialog.showSaveDialog(
    getCurrentWindow(),
    {
      defaultPath: path.join(app.getPath('documents'), fileName),
    },
    (filename: any) => {
      if (filename) {
        afterFn(filename);
      }
    }
  );
};

export const selectFile = (
  args: object,
  cb: (e: string[] | undefined) => void
): void => {
  dialog.showOpenDialog(
    {
      defaultPath: app.getPath('documents'),
      ...args,
    },
    cb
  );
};

export const readTxtByLine = (
  filePath: string,
  readFn: (e: object) => void
) => {
  dispatch('read-text', filePath);
  RPC.on('get-text-line', (params: any) => {
    readFn(params);
    if (params.status === 'done') {
      RPC.removeListener('get-text-line', () => {});
    }
  });
};

export const removeFile = (filePath: string) => {
  dispatch('remove-file', filePath);
};

export const cleanAppCache = (cb?: Function) => {
  dispatch('clean-app-cache', {});
  RPC.once('clean-app-cache-done', (args: any) => {
    cb && cb(args);
  });
};

export const cleanAppData = (cb?: Function) => {
  dispatch('clean-app-data', {});
  RPC.once('clean-app-data-done', (args: any) => {
    cb && cb(args);
  });
};
