import * as uuid from 'uuid';
import winCreate from '../winCreate';
import { pkg } from '../../utils/env';
import { IServer, Server } from '../rpc';
import createAppTray from '../../utils/tray';
import { showBetterMessageBox } from 'electron-better-dialog';
import inject from './inject';

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

  RPC.on('create-window', ({ options, entry, injectBridges }: any) => {
    if (!win) {
      return;
    }
    const childWin = winCreate(options, entry, true, win);
    const childRPC = new Server(childWin);
    inject(childRPC, injectBridges);

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

  inject(RPC, [
    'detector',
    'readWrite',
    'download',
    'crypto',
    'createProject',
    'createImageCache',
    'createServer',
  ]);

  return { tray };
};
