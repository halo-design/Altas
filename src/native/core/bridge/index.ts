import * as uuid from 'uuid';
import winCreate from '../winCreate';
import { pkg } from '../../utils/env';
import { IServer, Server } from '../rpc';
import createAppTray from '../../utils/tray';
import { showBetterMessageBox } from 'electron-better-dialog';

import globalBridge from './global';
import detector from './detector';
import readWrite from './readWrite';
import download from './download';
import crypto from './crypto';
import createProject from './createProject';
import createImageCache from './createImageCache';

export default (RPC: IServer) => {
  const { dispatch, win } = RPC;
  const windowContainer = {};

  let tray: any = null;

  if (win) {
    tray = createAppTray(RPC);
    tray.setToolTip('Altas ' + pkg.version);

    RPC.on('set-tray-title', (args: any) => {
      tray.setTitle(args);
    });

    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show();
    });
  }

  RPC.on('on-dialog-message', (args: any) => {
    win && showBetterMessageBox(win, args);
  });

  RPC.on('create-window', ({ options, entry }: any) => {
    if (!win) {
      return;
    }
    const childWin = winCreate(options, entry, true);
    const childRPC = new Server(childWin);
    globalBridge(childRPC);

    const uid = uuid.v4();
    windowContainer[uid] = childWin;
    dispatch('get-window-id', { win_uid: uid });
  });

  RPC.on('close-window', (args: any) => {
    if (args.uid in windowContainer) {
      const targetWin = windowContainer[args.uid];
      if (!targetWin.isDestroyed()) {
        targetWin.close();
      }
    }
  });

  [
    detector,
    readWrite,
    download,
    crypto,
    createProject,
    createImageCache,
  ].forEach((item: any) => {
    item(RPC);
  });

  return { tray };
};
