import * as url from 'url';
import file from './file';
import winStateKeeper from './winStateKeeper';
import { BrowserWindow } from 'electron';
import { isMac } from '../utils/env';

const winCreater = (opts: any, entry: any, isChild?: boolean) => {
  const options: any = {
    appIcon: file.path('resources/dock.png'),
    center: true,
    frame: false,
    fullscreenable: false,
    icon: file.path('resources/dock.ico'),
    titleBarStyle: 'hidden',
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true,
      webviewTag: true,
    },
    show: false,
    resizable: true,
  };

  Object.assign(options, opts);

  let win: any;
  if (isChild) {
    win = new BrowserWindow(options);

    if (isMac()) {
      win.setWindowButtonVisibility(false);
    }
  } else {
    win = winStateKeeper(options);
    // win.setContentProtection(true);
  }

  win.once('ready-to-show', win.show);

  const entryUrl =
    typeof entry === 'string'
      ? entry
      : url.format({
          pathname: file.path(entry.pathname),
          protocol: 'file:',
          slashes: true,
          hash: entry.hash,
        });

  win.loadURL(entryUrl);
  return win;
};

export default winCreater;
