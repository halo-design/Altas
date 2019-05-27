import { BrowserWindow } from 'electron';
import * as url from 'url';
import file from '../utils/file';
import keeper from './winStateKeeper';

const winCreate = (opts: any, entry: string) => {
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
    resizable: false,
  };

  if (process.platform === 'darwin') {
    options.vibrancy = 'appearance-based';
  } else {
    options.backgroundColor = '#fff';
  }

  Object.assign(options, opts);

  const mainWindow = keeper(new BrowserWindow(options), {
    width: opts.width,
    height: opts.height,
  });

  const entryUrl = url.format({
    pathname: file.path(entry),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(entryUrl);

  return mainWindow;
};

export default winCreate;
