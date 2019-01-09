const { Menu } = require('electron')

const createMenu = () => {
  const template = [{
    label: '编辑',
    submenu: [{
      label: '撤销',
      accelerator: 'CmdOrCtrl+Z',
      role: '撤销'
    }, {
      label: '恢复',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: '恢复'
    }, {
      type: 'separator'
    }, {
      label: '剪切',
      accelerator: 'CmdOrCtrl+X',
      role: '剪切'
    }, {
      label: '复制',
      accelerator: 'CmdOrCtrl+C',
      role: '复制'
    }, {
      label: '粘贴',
      accelerator: 'CmdOrCtrl+V',
      role: '粘贴'
    }, {
      label: '全选',
      accelerator: 'CmdOrCtrl+A',
      role: '全选'
    }]
  }, {
    label: '视图',
    submenu: [{
      label: '重载',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.reload()
        }
      }
    }, {
      label: '切换全屏',
      accelerator: process.platform == 'darwin' ? 'Ctrl+Command+F' : 'F11',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        }
      }
    }, {
      label: '切换开发者工具',
      accelerator: process.platform == 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    }]
  }, {
    label: '窗口',
    role: '窗口',
    submenu: [{
      label: '最小化',
      accelerator: 'CmdOrCtrl+M',
      role: '最小化'
    }, {
      label: '关闭',
      accelerator: 'CmdOrCtrl+W',
      role: '关闭'
    }]
  }, {
    label: '帮助',
    role: '帮助',
    submenu: [{
      label: '作者博客',
      click: () => {
        require('electron')
          .shell
            .openExternal('http://106.14.138.86:7000/halo/')
      }
    }]
  }]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = createMenu
