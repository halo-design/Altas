const { app } = require('electron')
const createWindow = require('./createWindow')
const storage = require('electron-json-storage')

const ipcBridge = require('./utils/bridge')
const createAppTray = require('./utils/tray')

let mainWindow
let forceQuit = false

const init = () => {
  mainWindow = createWindow({
    entry: 'browser/index.html',
    width: 960,
    height: 620,
    bridge: ipcBridge
  })

  const tray = createAppTray(mainWindow)
  tray.setToolTip('Altas')

  mainWindow.on('close', (e) => {
    if (forceQuit) {
      mainWindow = null
      app.quit()
    } else {
      e.preventDefault()
      mainWindow.hide()
    }
  })

}

app.on('ready', init)

app.on('before-quit', () => {
  forceQuit = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    init()
  } else {
    mainWindow.show()
  }
})
