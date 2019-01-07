const electron = require('electron')
const { showBetterMessageBox } = require('electron-better-dialog')
const { ipcMain, clipboard } = electron

module.exports = (mainWindow, pkg) => {
  let isDownloading = false

  // 监听应用弹窗
  // https://www.npmjs.com/package/electron-better-dialog
  ipcMain.on('on-dialog-message', (event, arg, cb) => {
    isMessageBoxVisible = true
    showBetterMessageBox(mainWindow, arg, cb)
  })

  // 应用启动监听
  ipcMain.on('ipc-start', (event, arg) => {
    event.sender.send('ipc-running', pkg)
  })

  // 文件下载进度及状态监听
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    isDownloading = true

    item.on('updated', (ev, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
      mainWindow.webContents.send('on-download-state', {
        status: state,
        totalBytes: item.getTotalBytes(),
        recieveBytes: item.getReceivedBytes(),
        state: item.getState()
      })
    })

    item.on('done', (ev, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }

      mainWindow.webContents.send('on-download-state', {
        status: state,
        totalBytes: item.getTotalBytes(),
        recieveBytes: item.getReceivedBytes(),
        state: item.getState()
      })

      isDownloading = false
    })
  })

  // 文件下载监听
  ipcMain.on('file-download', (event, remoteFilePath) => {
    if (isDownloading) {
      return
    }
    mainWindow.webContents.downloadURL(remoteFilePath)
  })

  // 剪贴板监听
  ipcMain.on('read-clipboard', (event, arg) => {
    event.sender.send('get-clipboard-text', clipboard.readText())
  })
}