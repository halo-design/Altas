import { app, Menu, Tray } from 'electron';
import file from './file';

const isWin = process.platform === 'win32';

export default (RPC: any) => {
  const img = isWin
    ? file.path('resources/dock.ico')
    : file.path('resources/icon.png');

  const appIcon = new Tray(img);

  const menu = Menu.buildFromTemplate([
    {
      click: () => {
        RPC.dispatch('history-push', '/settings');
        RPC.win.show();
        RPC.win.focus();
      },
      label: '参数设置',
    },
    {
      type: 'separator',
    },
    {
      click: () => {
        RPC.win.show();
      },
      label: '打开应用',
    },
    {
      type: 'separator',
    },
    {
      click: () => {
        app.exit(0);
      },
      label: '退出应用',
    },
  ]);

  appIcon.setContextMenu(menu);
  return appIcon;
};
