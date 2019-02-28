const { app, ipcMain } = require('electron')
const createWindow = require('./createWindow')
const storage = require('electron-json-storage')

const ipcBridge = require('./utils/bridge')
const createAppTray = require('./utils/tray')

let mainWindow
let tray
let forceQuit = false

const init = () => {
  mainWindow = createWindow({
    entry: 'browser/index.html',
    width: 960,
    height: 620,
    bridge: ipcBridge
  })

  tray = createAppTray(mainWindow)
  tray.setToolTip('Altas')

  ipcMain.on('set-tray-title', (event, args) => {
    tray.setTitle(args)
  })

  tray.on('click', () => {
    mainWindow.isVisible()
      ? mainWindow.hide()
      : mainWindow.show()
  })

  mainWindow.on('close', (e) => {
    if (forceQuit) {
      tray.destroy()
      mainWindow = null
      tray = null
      app.quit()
    } else {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.hide()
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
