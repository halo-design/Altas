import { app, Menu, shell, Tray } from 'electron';
import file from './file';

const isWin = process.platform === 'win32';

export default (mainWindow: Electron.BrowserWindow) => {
  const img = isWin
    ? file.path('resources/dock.ico')
    : file.path('resources/icon.png');

  const appIcon = new Tray(img);

  const menu = Menu.buildFromTemplate([
    {
      click: () => {
        mainWindow.webContents.send('history-push', '/sync');
        mainWindow.show();
        mainWindow.focus();
      },
      label: '设置',
    },
    {
      type: 'separator',
    },
    {
      click: () => {
        shell.openExternal('https://github.com/halo-design/Altas');
      },
      label: '关于',
    },
    {
      click: () => {
        app.quit();
      },
      label: '退出',
    },
  ]);

  appIcon.setContextMenu(menu);
  return appIcon;
};
