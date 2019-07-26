import * as uuid from 'uuid';
import winCreater from '../../winCreater';
import { IServer, Server } from '../../rpc';
import inject from '../inject';
import { showBetterMessageBox } from 'electron-better-dialog';
import log from 'electron-log';

const windowContainer = {};

export default (RPC: IServer) => {
  const { dispatch, win } = RPC;

  RPC.on('on-dialog-message', (args: any) => {
    win && showBetterMessageBox(win, args);
  });

  RPC.on('create-window', ({ options, entry, injectBridges, winId }: any) => {
    if (!win) {
      return;
    }

    const uid = winId || uuid.v4();
    log.info(
      `Window Inject Bridges: ${
        injectBridges.length > 0 ? injectBridges.join(', ') : 'null'
      }`
    );
    log.info(`Window "${uid}" Created!`);
    if (uid in windowContainer) {
      windowContainer[uid].focus();
      return;
    }
    const childWin = winCreater(options, entry, true, win);
    const childRPC = new Server(childWin);
    inject(childRPC, injectBridges);

    windowContainer[uid] = childWin;

    childWin.on('closed', () => {
      log.info(`Window "${uid}" Destroyed!`);
      delete windowContainer[uid];
    });

    dispatch('get-window-id', { winId: uid });
  });

  RPC.on('close-window', (args: any) => {
    if (args.uid in windowContainer) {
      const targetWin = windowContainer[args.uid];
      if (!targetWin.isDestroyed()) {
        targetWin.close();
      }
    }
  });
};
