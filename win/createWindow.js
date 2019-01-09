const { BrowserWindow } = require('electron')
const windowStateKeeper = require('electron-window-state')
const url = require('url')

const file = require('../utils/file')
const pkg = require('../package.json')

const isWin = process.platform === 'win32'
const isDev = process.env.NODE_ENV === 'development'

const createWindow = ({ entry, width, height, bridge, devtool }) => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  })

  let mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    transparent: false,
    backgroundColor: '#fff',
    titleBarStyle: 'hidden',
    resizable: isDev,
    alwaysOnTop: !isDev,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true
    },
    frame: !isWin,
    appIcon: file.path('win/resource/dock.png')
  })

  mainWindowState.manage(mainWindow)

  mainWindow.loadURL(url.format({
    pathname: file.path(entry),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  bridge(mainWindow, pkg)

  return mainWindow
}

module.exports = createWindow
