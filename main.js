const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const windowStateKeeper = require('electron-window-state')
const remote = require('./controller/remote')
const semver = require('semver')

const path = require('path')
const url = require('url')
const fs = require('fs-extra')

let remoteVersion = {}

const tmpDir = path.join(__dirname, './tmp')
const appDir = path.join(__dirname, './app/static')
let isTmpEmpty = !fs.existsSync(path.join(tmpDir, 'index.js'))

const remoteAppUri = 'https://raw.githubusercontent.com/halo-design/Altas/master/app.zip'
const remoteVersionUri = 'https://raw.githubusercontent.com/halo-design/Altas/master/version.json'

const appIcon = `${__dirname}/app/resource/dock.png`

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

  ipcMain.on('check-update', (event, arg) => {
    isTmpEmpty = !fs.existsSync(path.join(tmpDir, 'index.js'))
    if (!isTmpEmpty) {
      console.log('更新下载完成，重启以更新！')
      event.sender.send('get-update-state', 'ready-to-reload')
      return
    }
    remote.getRemoteJson(remoteVersionUri).then(data => {
      remoteVersion = data
      const localVersion = JSON.parse(fs.readFileSync(path.join(__dirname, 'version.json')))
      const isNeedUpdate = semver.gt(remoteVersion.version, localVersion.version)
      if (isNeedUpdate) {
        console.log(localVersion)
        console.log('检查到有最新更新！')
      }
      event.sender.send('get-update-state', isNeedUpdate ? 'need-to-download' : 'already-latest')
    })
  })

  ipcMain.on('get-update-cache', (event, arg) => {
    if (downloading) {
      return
    }
    fs.emptyDirSync(tmpDir)
    downloading = true
    remote.downloadRepoZip(remoteAppUri, tmpDir).then(path => {
      fs.writeFileSync('version.json', JSON.stringify(remoteVersion, null, 2), 'utf8')

      console.log('已下载好最新更新！')
      downloading = false
      event.sender.send('get-update-state', 'ready-to-reload')
    }).catch(err => {
      event.sender.send('get-update-state', 'need-to-download')
    })
  })

  ipcMain.on('reload-window', (event, arg) => {
    mainWindow.destroy()
    fs.emptyDirSync(appDir)
    fs.copySync(tmpDir, appDir)
    fs.emptyDirSync(tmpDir)
    createWindow()
  })

  ipcMain.on('read-changelog', (event, arg) => {
    event.sender.send('get-changelog', JSON.parse(fs.readFileSync(path.join(__dirname, 'version.json'))))
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
