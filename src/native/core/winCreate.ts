import * as url from 'url';
import file from '../utils/file';
import winStateKeeper from './winStateKeeper';
import { BrowserWindow } from 'electron';
const isMac = process.platform === 'darwin';

const winCreate = (opts: any, entry: any, isChild?: boolean) => {
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
    resizable: true,
  };

  if (isMac) {
    options.vibrancy = 'appearance-based';
  } else {
    options.backgroundColor = '#fff';
  }

  Object.assign(options, opts);

  let mainWindow: any;
  if (isChild) {
    mainWindow = new BrowserWindow(options);

    if (isMac) {
      mainWindow.setWindowButtonVisibility(false);
    }

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
  } else {
    mainWindow = winStateKeeper(options);
  }

  const entryUrl =
    typeof entry === 'string'
      ? entry
      : url.format({
          pathname: file.path(entry.pathname),
          protocol: 'file:',
          slashes: true,
          hash: entry.hash,
        });

  mainWindow.loadURL(entryUrl);
  mainWindow.hide();
  return mainWindow;
};

export default winCreate;
