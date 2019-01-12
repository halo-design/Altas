import { remote } from 'electron';
const { app, Menu, shell }= remote;

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';

const createMenu = (editor?: (tpl: any[]) => any[]) => {
  const appTpl :any = {
    label: 'Altas',
    submenu: [{
      click: () => {
        shell.openExternal('https://github.com/halo-design/Altas');
      },
      label: `关于Altas`,
    }]
  }

  const viewTpl: any = {
    label: '视图',
    submenu: [{
      accelerator: 'CmdOrCtrl+R',
      click: (item: any, focusedWindow: any) => {
        if (focusedWindow) {
          focusedWindow.reload()
        }
      },
      label: '刷新',
    }]
  }

  if (isMac) {
    viewTpl.submenu.push({
      accelerator: 'Ctrl+Command+F',
      click: (item: any, focusedWindow: any) => {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        }
      },
      label: '切换全屏',
    })
  }

  const winTpl: any = {
    label: '窗口',
    role: '窗口',
    submenu: [{
      accelerator: 'CmdOrCtrl+M',
      click: (item: any, focusedWindow: any) => {
        if (focusedWindow) {
          focusedWindow.minimize()
        }
      },
      label: '最小化',
      role: '最小化',
    }, {
      accelerator: 'CmdOrCtrl+W',
      click: () => {
        app.quit()
      },
      label: '关闭',
      role: '关闭',
    }, {
      checked: false,
        click: (item: any, focusedWindow: any) => {
          if (focusedWindow) {
            focusedWindow.setAlwaysOnTop(item.checked)
          }
        },
      label: '置于顶部',
      type: 'checkbox',
    }]
  }
  
  const helpTpl: any = {
    label: '帮助',
    role: '帮助',
    submenu: [{
      click: () => {
        shell.openExternal('http://106.14.138.86:7000/halo/');
      },
      label: '作者博客',
    }]
  }

  if (isDev) {
    helpTpl.submenu.push({
      accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click: (item: any, focusedWindow: any) => {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      },
      label: '切换开发者工具',
    })
  }

  let template = [viewTpl, winTpl, helpTpl];
  
  if (editor) {
    template = editor(template);
  }

  template.unshift(appTpl);

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export default createMenu;
