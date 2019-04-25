import { BrowserWindow } from 'electron';
import * as url from 'url';
import file from './utils/file';
// tslint:disable-next-line:no-var-requires
const windowStateKeeper = require('electron-window-state');

const info = {
  appName: 'Altas',
  version: '0.2.4'
}

// const isDev = process.env.NODE_ENV === 'development'
const isMac = process.platform === 'darwin'

interface ICreateWindow {
  entry: string;
  width: number;
  height: number;
  bridge: (mainWindow: Window, info: object) => void;
}

const createWindow = ({ entry, width, height, bridge }: ICreateWindow) => {
  const mainWindowState = windowStateKeeper({
    defaultHeight: height,
    defaultWidth: width,
  })

  const options: any = {
    appIcon: file.path('resources/dock.png'),
    center: true,
    frame: false,
    fullscreenable: false,
    height: mainWindowState.height,
    icon: file.path('resources/dock.ico'),
    titleBarStyle: 'hidden',
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true
    },
    width: mainWindowState.width,
    x: mainWindowState.x,
    y: mainWindowState.y,
    // resizable: isDev,
    // alwaysOnTop: isDev,
  }

  if (isMac) {
    options.vibrancy = 'titlebar'
  } else {
    options.backgroundColor = '#fff'
  }

  let mainWindow: any = new BrowserWindow(options)

  mainWindowState.manage(mainWindow)

  const entryUrl = url.format({
    pathname: file.path(entry),
    protocol: 'file:',
    slashes: true
  })

  mainWindow.loadURL(entryUrl)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  bridge(mainWindow, info)

  return mainWindow
}

export default createWindow;
