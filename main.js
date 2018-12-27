const electron = require('electron')
const { app, BrowserWindow } = electron
const windowStateKeeper = require('electron-window-state')
const download = require('download-git-repo')

const path = require('path')
const url = require('url')
const localPkg = require('./package.json')
const tmpDir = path.join(__dirname, './tmp')
const appIcon = `${__dirname}/app/resource/dock.png`

let mainWindow

function createWindow () {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 960,
    defaultHeight: 620,
  })

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
      scrollBounce: true
    },
    frame: process.platform !== 'win32',
    appIcon
  })

  mainWindowState.manage(mainWindow)

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

download('halo-design/Altas', tmpDir, err => {
  console.log(err ? 'Error' : 'Success')
})

download('direct:https://raw.githubusercontent.com/halo-design/Altas/master/app.zip', tmpDir, err => {
  console.log(err ? 'Error' : 'Success')
})
