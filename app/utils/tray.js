const { app, Menu, Tray, shell, ipcMain } = require('electron')
const file = require('./file')

const isWin = process.platform === 'win32'

module.exports = (mainWindow) => {

  let img = file.path('app/resource/icon.png')

  if (isWin) {
    img = file.path('app/resource/dock.ico')
  }

  const appIcon = new Tray(img)

  const menu = Menu.buildFromTemplate([{
    click: () => {
      mainWindow.webContents.send('history-push', '/sync')
    },
    label: '设置',
  }, {
    click: () => {
      shell.openExternal('https://github.com/halo-design/Altas')
    },
    label: '关于',
  }, {
    click: () => { 
      app.quit()
    },
    label: '退出',
  }])

  appIcon.setContextMenu(menu)
  return appIcon
}

