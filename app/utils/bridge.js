const electron = require('electron')
const { showBetterMessageBox } = require('electron-better-dialog')
const ip = require('ip')
const md5 = require('md5')
const notifier = require('node-notifier')
const DL = require('electron-dl')
const { ipcMain, clipboard } = electron
const readTxtByLine = require('./readTxtByLine')
const storage = require('electron-json-storage')
const crypto = require('./crypto')
const file = require('./file')
const os = require('os')

module.exports = (mainWindow, pkg) => {
  // 获取app绝对目录
  ipcMain.on('get-appdir', (event, args) => {
    event.sender.send('appdir', file.root)
  })

  // 数据写入
  ipcMain.on('write-storage', (event, key, data) => {
    storage.set(key, data, err => {
      if (err) {
        throw err;
      } else {
        console.log(data)
        console.log(`[${key}]：数据已写入`)
      }
    })
  })

  // 数据读取
  ipcMain.on('read-storage', (event, key) => {
    storage.get(key, (err, data) => {
      event.sender.send('get-storage', data)
    })
  })

  // 数据删除
  ipcMain.on('remove-storage', (event, key) => {
    storage.remove(key)
    console.log(`[${key}]：数据已删除`)
  })

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
      } else {
        network.mac = '未知'
      }
      network.ip = ip.address()
      event.sender.send('ip-address', network)
    })
  })

  // 获取本机硬件信息
  ipcMain.on('get-device-os', (event, args) => {
    const info = {
      arch: os.arch(),
      cpu: os.cpus(),
      release: os.release(),
      homedir: os.homedir(),
      tmpdir: os.tmpdir(),
      type: os.type(),
      uptime: os.uptime(),
      userInfo: os.userInfo(),
      memory: os.totalmem(),
      hostname: os.hostname(),
      network: os.networkInterfaces(),
      platform: os.platform()
    }
    event.sender.send('device-os', info)
  })

  // AES加密字符串
  ipcMain.on('aes-encode', (event, args) => {
    const mdString = md5(args.pswd);
    const key = mdString.slice(0, 16);
    const iv = mdString.slice(16);
    event.sender.send('get-aes-encode', crypto.aseEncode(args.data, key, iv))
  })

  // AES解密字符串
  ipcMain.on('aes-decode', (event, args) => {
    const mdString = md5(args.pswd);
    const key = mdString.slice(0, 16);
    const iv = mdString.slice(16);
    event.sender.send('get-aes-decode', crypto.aseDecode(args.data, key, iv))
  })
}