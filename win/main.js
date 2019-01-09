const { app } = require('electron')
const createWindow = require('./createWindow')

const ipcBridge = require('../utils/bridge')
const isDev = process.env.NODE_ENV === 'development'

const init = () => {
  createWindow({
    entry: 'app/index.html',
    width: 960,
    height: 620,
    bridge: ipcBridge,
    devtool: isDev
  })
}

app.on('ready', init)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    init()
  }
})
