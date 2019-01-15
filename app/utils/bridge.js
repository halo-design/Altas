const electron = require('electron')
const { showBetterMessageBox } = require('electron-better-dialog')
const ip = require('ip')
const DL = require('electron-dl')
const { ipcMain, clipboard } = electron
const readTxtByLine = require('./readTxtByLine')

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

  // 按行读取本地文件
  ipcMain.on('read-text', (event, args) => {
    readTxtByLine(args, (index, line) => {
      const params = { index, line, status: 'pending' };
      event.sender.send('get-text-line', params)
    }, () => {
      event.sender.send('get-text-line', { status: 'done' });
    })
  })

  // 文件下载监听
  // https://www.npmjs.com/package/electron-dl
  ipcMain.on('file-download', (event, url, args) => {
    let timer
    let dlItem

    const createTimer = () => {
      const t = args.timeout
      if (t) {
        timer = setTimeout(() => {
          dlItem && dlItem.cancel()
          console.log(url + '[下载超时，已取消]')
        }, t)
      }
    }


    DL.download(mainWindow, url, {
      onStarted: e => {
        dlItem = e;
        createTimer()
        mainWindow.webContents.send('on-download-state', {
          status: 'start',
          progress: 0,
          index: args.index || 0
        })
      },
      onCancel: e => {
        timer && clearTimeout(timer)
        mainWindow.webContents.send('on-download-state', {
          status: 'cancel',
          progress: 0,
          index: args.index || 0
        })
      },
      onProgress: e => {
        timer && clearTimeout(timer)
        createTimer()
        mainWindow.webContents.send('on-download-state', {
          status: 'running',
          progress: e,
          index: args.index || 0
        })
      },
      ...args
    })
      .then(dl => {
        timer && clearTimeout(timer)
        console.log(dl.getSavePath())
        mainWindow.webContents.send('on-download-state', {
          status: 'finished',
          progress: 1,
          index: args.index || 0
        })
      })
      .catch(() => {
        timer && clearTimeout(timer)
        mainWindow.webContents.send('on-download-state', {
          status: 'error',
          progress: 0,
          index: args.index || 0
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