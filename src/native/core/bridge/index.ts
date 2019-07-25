import { pkg } from '../../utils/env';
import { IServer } from '../rpc';
import createAppTray from '../../utils/tray';
import inject from './inject';

export default (RPC: IServer) => {
  const { win } = RPC;

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

  inject(RPC, [
    'createWindow',
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
