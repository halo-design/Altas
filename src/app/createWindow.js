const { BrowserWindow } = require('electron')
const windowStateKeeper = require('electron-window-state')
const url = require('url')

const file = require('./utils/file')

const info = {
  appName: 'Altas',
  version: '0.2.4'
}

// const isDev = process.env.NODE_ENV === 'development'
const isMac = process.platform === 'darwin'

const createWindow = ({ entry, width, height, bridge }) => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  })

  const options = {
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    center: true,
    fullscreenable: false,
    transparent: false,
    titleBarStyle: 'hidden',
    // resizable: isDev,
    // alwaysOnTop: isDev,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true
    },
    frame: false,
    icon: file.path('resources/dock.ico'),
    appIcon: file.path('resources/dock.png')
  }

  if (isMac) {
    options.vibrancy = 'titlebar'
  } else {
    options.backgroundColor = '#fff'
  }

  let mainWindow = new BrowserWindow(options)

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

module.exports = createWindow
