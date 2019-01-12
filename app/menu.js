const { Menu, shell } = require('electron')
const isDev = process.env.NODE_ENV === 'development'
const isMac = process.platform === 'darwin'

const createMenu = (app) => {
  const viewTpl = {
    label: '视图',
    submenu: [{
      label: '刷新',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.reload()
        }
      }
    }]
  }

  if (isMac) {
    viewTpl.submenu.push({
      label: '切换全屏',
      accelerator: process.platform == 'darwin' ? 'Ctrl+Command+F' : 'F11',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        }
      }
    })
  }

  const winTpl = {
    label: '窗口',
    role: '窗口',
    submenu: [{
      label: '最小化',
      accelerator: 'CmdOrCtrl+M',
      role: '最小化',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.minimize()
        }
      }
    }, {
      label: '关闭',
      accelerator: 'CmdOrCtrl+W',
      role: '关闭',
      click: () => {
        app.quit()
      }
    }, {
      label: '置于顶部',
      type: 'checkbox',
      checked: false,
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.setAlwaysOnTop(item.checked)
        }
      }
    }]
  }

  const appTpl = {
    label: '应用',
    role: '应用',
    submenu: [{
      label: '重启应用',
      role: '重启应用',
      click: () => {
        app.relaunch()
        app.exit(0)
      }
    }]
  }

  if (isDev) {
    appTpl.submenu.push({
      label: '切换开发者工具',
      accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    })
  }

  const helpTpl = {
    label: '帮助',
    role: '帮助',
    submenu: [{
      label: '作者博客',
      click: () => {
        shell.openExternal('http://106.14.138.86:7000/halo/')
      }
    }]
  }

  const template = [viewTpl, winTpl, appTpl, helpTpl]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = createMenu
