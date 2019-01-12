const electron = require('electron')
const { showBetterMessageBox } = require('electron-better-dialog')
const ip = require('ip')
const DL = require('electron-dl')
const { ipcMain, clipboard } = electron

module.exports = (mainWindow, pkg) => {
  // 监听应用弹窗
  // https://www.npmjs.com/package/electron-better-dialog
  ipcMain.on('on-dialog-message', (event, args) => {
    showBetterMessageBox(mainWindow, args)
  })

  // 应用启动监听
  ipcMain.on('ipc-start', (event, args) => {
    event.sender.send('ipc-running', pkg)
  })

  // 文件下载监听
  // https://www.npmjs.com/package/electron-dl
  ipcMain.on('file-download', (event, url, args) => {
    DL.download(mainWindow, url, {
      onStarted: e => {
        mainWindow.webContents.send('on-download-state', {
          status: 'start',
          progress: 0
        })
      },
      onCancel: e => {
        mainWindow.webContents.send('on-download-state', {
          status: 'cancel',
          progress: 0
        })
      },
      onProgress: e => {
        mainWindow.webContents.send('on-download-state', {
          status: 'running',
          progress: e
        })
      },
      ...args
    })
      .then(dl => {
        console.log(dl.getSavePath())
        mainWindow.webContents.send('on-download-state', {
          status: 'finished',
          progress: 1
        })
      })
      .catch(() => {
        mainWindow.webContents.send('on-download-state', {
          status: 'error',
          progress: 0
        })
      })
  })

  // 剪贴板监听
  ipcMain.on('read-clipboard', (event, args) => {
    event.sender.send('get-clipboard-text', clipboard.readText())
  })

  // 写入剪切板监听
  ipcMain.on('write-clipboard', (event, args) => {
    clipboard.writeText(args)
  })

  // 获取本机IP、MAC地址
  ipcMain.on('get-ip-address', (event, args) => {
    const network = {}
    require('getmac').getMac((err, macAddress) => {
      if (!err) {
        network.mac = macAddress
      }
      network.ip = ip.address()
      event.sender.send('ip-address', network)
    })
  })
}