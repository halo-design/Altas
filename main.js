const electron = require('electron')
const { app, BrowserWindow } = electron
const windowStateKeeper = require('electron-window-state')
const url = require('url')

const file = require('./utils/file')
const ipcBridge = require('./utils/bridge')
const pkg = require('./package.json')

const { appName, version } = pkg
const isWin = process.platform === 'win32'
const isDev = process.env.NODE_ENV === 'development'
let mainWindow

function createWindow () {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 960,
    defaultHeight: 620,
  })

  console.log(`${appName} ${version}已启动！`);

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    transparent: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: 'none',
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true
    },
    frame: isWin,
    appIcon: file.path('app/resource/dock.png')
  })

  mainWindowState.manage(mainWindow)

  mainWindow.loadURL(url.format({
    pathname: file.path('app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  isDev && mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcBridge(mainWindow, pkg)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
