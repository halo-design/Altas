import { remote } from 'electron';
import { getAppDir } from '../system';
import { isDev, isMac } from './env';
import { homePage, feedbackPage } from '../../constants/API';

const { app, Menu, shell } = remote;

const createAppMenu = (editor?: (tpl: any[]) => any[]): void => {
  const appTpl: any = {
    label: 'Altas',
    submenu: [
      {
        click: () => {
          shell.openExternal(homePage);
        },
        label: `关于Altas`,
      },
      {
        type: 'separator',
      },
      {
        click: () => {
          app.relaunch();
          app.exit(0);
        },
        label: '重启应用',
        role: '重启应用',
      },
      {
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit();
        },
        label: '退出应用',
        role: '退出应用',
      },
    ],
  };

  const editTpl = {
    label: '编辑',
    submenu: [
      {
        accelerator: 'CmdOrCtrl+Z',
        click: (item: any, win: any) => {
          const content = win.webContents;
          content.undo();
        },
        label: '撤销',
        role: '撤销',
      },
      {
        accelerator: 'Shift+CmdOrCtrl+Z',
        click: (item: any, win: any) => {
          const content = win.webContents;
          content.redo();
        },
        label: '恢复',
        role: '恢复',
      },
      {
        type: 'separator',
      },
      {
        accelerator: 'CmdOrCtrl+X',
        click: (item: any, win: any) => {
          const content = win.webContents;
          content.cut();
        },
        label: '剪切',
        role: '剪切',
      },
      {
        accelerator: 'CmdOrCtrl+C',
        click: (item: any, win: any) => {
          const content = win.webContents;
          content.copy();
        },
        label: '复制',
        role: '复制',
      },
      {
        accelerator: 'CmdOrCtrl+V',
        click: (item: any, win: any) => {
          const content = win.webContents;
          content.paste();
        },
        label: '粘贴',
        role: '粘贴',
      },
      {
        accelerator: 'CmdOrCtrl+A',
        click: (item: any, win: any) => {
          const content = win.webContents;
          content.selectAll();
        },
        label: '全选',
        role: '全选',
      },
    ],
  };

  const viewTpl: any = {
    label: '视图',
    submenu: [
      {
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          // 刷新页面
          location.href = '#/refresh';
          if (isDev) {
            getAppDir(({ root }: any) => {
              document.getElementsByTagName(
                'link'
              )[0].href = `${root}renderer/static/index.css?${Date.now()}`;
            });
          }
        },
        label: '刷新',
      },
    ],
  };

  const winTpl: any = {
    label: '窗口',
    role: '窗口',
    submenu: [
      {
        accelerator: 'CmdOrCtrl+M',
        click: (item: any, win: any) => {
          win.minimize();
        },
        label: '最小化',
        role: '最小化',
      },
      {
        click: (item: any, win: any) => {
          win.isMaximized() ? win.unmaximize() : win.maximize();
        },
        label: '缩放',
        role: '缩放',
      },
      {
        accelerator: 'CmdOrCtrl+W',
        click: (item: any, win: any) => {
          win.close();
        },
        label: '关闭',
        role: '关闭',
      },
      {
        type: 'separator',
      },
      {
        checked: false,
        click: (item: any, win: any) => {
          win.setAlwaysOnTop(item.checked);
        },
        label: '置于顶部',
        type: 'checkbox',
      },
    ],
  };

  const helpTpl: any = {
    label: '帮助',
    role: '帮助',
    submenu: [
      {
        click: () => {
          shell.openExternal(feedbackPage);
        },
        label: '给作者留言',
      },
    ],
  };

  if (isDev) {
    helpTpl.submenu.push(
      {
        type: 'separator',
      },
      {
        accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: (item: any, win: any) => {
          win.toggleDevTools();
        },
        label: '应用调试器',
      }
    );
  }

  let template = [editTpl, viewTpl, winTpl, helpTpl];

  if (editor) {
    template = editor(template);
  }

  template.unshift(appTpl);

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

export default createAppMenu;
