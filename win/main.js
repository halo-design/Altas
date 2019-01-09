const { app } = require('electron')
const createWindow = require('./createWindow')
const createMenu = require('./menu')

const ipcBridge = require('../utils/bridge')
let mainWindow

const init = () => {
  createMenu()

  mainWindow = createWindow({
    entry: 'app/index.html',
    width: 960,
    height: 620,
    bridge: ipcBridge
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
