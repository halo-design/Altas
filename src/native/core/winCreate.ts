import * as url from 'url';
import file from '../utils/file';
import winStateKeeper from './winStateKeeper';
import { BrowserWindow } from 'electron';

const winCreate = (
  opts: any,
  entry: any,
  parentWindow?: Electron.BrowserWindow,
  isChild?: boolean
) => {
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
    },
    resizable: true,
  };

  if (process.platform === 'darwin') {
    options.vibrancy = 'appearance-based';
  } else {
    options.backgroundColor = '#fff';
  }

  Object.assign(options, opts);

  let mainWindow: any;
  if (isChild) {
    Object.assign(options, {
      parent: parentWindow,
    });
    mainWindow = new BrowserWindow(options);
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
  } else {
    mainWindow = winStateKeeper(options);
  }

  const entryUrl = url.format({
    pathname: file.path(entry.pathname),
    protocol: 'file:',
    slashes: true,
    hash: entry.hash,
  });

  mainWindow.loadURL(entryUrl);

  return mainWindow;
};

export default winCreate;
