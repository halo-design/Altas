const { app, Menu, Tray, shell, ipcMain } = require('electron')
const file = require('./file')

const isWin = process.platform === 'win32'

module.exports = (mainWindow) => {
  const img = isWin
    ? file.path('resources/dock.ico')
    : file.path('resources/icon.png')

  const appIcon = new Tray(img)

  const menu = Menu.buildFromTemplate([{
    click: () => {
      mainWindow.webContents.send('history-push', '/sync')
      mainWindow.show()
      mainWindow.focus()
    },
    label: '设置',
  }, {
    type: 'separator'
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

