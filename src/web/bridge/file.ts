import { remote } from 'electron';
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
      defaultPath: app.getPath('downloads') + '/' + fileName,
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
