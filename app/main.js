const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const windowStateKeeper = require('electron-window-state')
const semver = require('semver')
const url = require('url')

const remote = require('./utils/remote')
const file = require('./utils/file')
const URI = require('./constants/URI')

let remoteVersion = {}
let downloading = false
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
    appIcon: file.path('resource/dock.png')
  })

  mainWindowState.manage(mainWindow)

  mainWindow.loadURL(url.format({
    pathname: file.path('web/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // 检查更新
  ipcMain.on('check-update', (event, arg) => {
    if (file.exist('tmp/app.zip')) {
      console.log('更新下载完成，重启以更新！')
      event.sender.send('get-update-state', 'ready-to-reload')
      return
    }

    remote.downloadFile(URI['version.json'], 'tmp/version.json').then(() => {
      remoteVersion = file.file2JSON('tmp/version.json')
      const localVersion = file.file2JSON('version.json')
      const isNeedUpdate = semver.gt(remoteVersion.version, localVersion.version)
      if (isNeedUpdate) {
        console.log(localVersion)
        console.log('检查到有最新更新！')
      }
      event.sender.send('get-update-state', isNeedUpdate ? 'need-to-download' : 'already-latest')
    })
  })

  // 获取更新
  ipcMain.on('get-update-cache', (event, arg) => {
    if (downloading) {
      return
    }
    downloading = true
    event.sender.send('zip-downloading')
    remote.downloadFile(URI['app.zip'], 'tmp/app.zip').then(() => {
      file.JSON2File('version.json', remoteVersion)
      event.sender.send('zip-download-complete')
      console.log('已下载好最新更新！')
      downloading = false
      event.sender.send('get-update-state', 'ready-to-reload')
    }).catch(err => {
      event.sender.send('get-update-state', 'need-to-download')
    })
  })

  // 重新加载页面以完成更新
  ipcMain.on('reload-window', (event, arg) => {
    mainWindow.destroy()
    // 此处应解压
    file.del('tmp/app.zip')
    createWindow()
  })

  // 查看更新日志
  ipcMain.on('read-changelog', (event, arg) => {
    event.sender.send('get-changelog', file.file2JSON('version.json'))
    event.sender.send('get-cahce-state', file.exist('tmp/app.zip'))
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
