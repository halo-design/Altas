const electron = require('electron')
const { app, BrowserWindow, ipcMain, dialog } = electron
const windowStateKeeper = require('electron-window-state')
const url = require('url')

const file = require('./utils/file')
const pkg = require('./package.json')

const { appName, version } = pkg
let mainWindow
let isDownloading = false

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
    frame: process.platform !== 'win32',
    appIcon: file.path('app/resource/dock.png')
  })

  mainWindowState.manage(mainWindow)

  mainWindow.loadURL(url.format({
    pathname: file.path('app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // 监听应用弹窗
  ipcMain.on('on-dialog-message', (event, arg) => {
    // https://github.com/JakeH/electron-better-dialog
    // {
    //   type: 'info',
    //   buttons: ['OK'],
    //   title: 'Altas',
    //   message: 'message',
    //   detail: 'Details.'
    // }
    dialog.showMessageBox({ type: 'info', ...arg })
  })

  // 应用启动监听
  ipcMain.on('ipc-start', (event, arg) => {
    console.log(`${appName} ${version}已经启动！`)
    event.sender.send('ipc-running', { appName, version })
  })

  // 文件下载监听
  ipcMain.on('file-download', (ev, remoteFilePath) => {
    if (isDownloading) {
      return
    }
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
      isDownloading = true

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed')
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused')
          } else {
            console.log(`Received bytes: ${item.getReceivedBytes()}`)
          }
        }
        ev.sender.send('on-download-state', {
          status: state,
          totalBytes: item.getTotalBytes(),
          recieveBytes: item.getReceivedBytes(),
          state: item.getState()
        })
      })
  
      item.once('done', (event, state) => {
        if (state === 'completed') {
          console.log('Download successfully')
        } else {
          console.log(`Download failed: ${state}`)
        }

        ev.sender.send('on-download-state', {
          status: state,
          totalBytes: item.getTotalBytes(),
          recieveBytes: item.getReceivedBytes(),
          state: item.getState()
        })

        isDownloading = false
      })
    })

    mainWindow.webContents.downloadURL(remoteFilePath)
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
