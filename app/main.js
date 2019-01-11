const { app } = require('electron')
const createWindow = require('./createWindow')

const ipcBridge = require('./utils/bridge')
let mainWindow

const init = () => {
  mainWindow = createWindow({
    entry: 'browser/index.html',
    width: 960,
    height: 620,
    bridge: ipcBridge
  })

  mainWindow.on('closed', function () {
    mainWindow = null
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
