import { app, ipcMain } from 'electron';
import createWindow from './createWindow';

import ipcBridge from './utils/bridge';
import createAppTray from './utils/tray';

let mainWindow: any;
let tray: any;
let forceQuit: boolean = false;

const init = () => {
  mainWindow = createWindow({
    bridge: ipcBridge,
    entry: 'renderer/index.html',
    height: 620,
    width: 980,
  });

  tray = createAppTray(mainWindow);
  tray.setToolTip('Altas');

  ipcMain.on('set-tray-title', (event: any, args: any) => {
    tray.setTitle(args);
  });

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  mainWindow.on('close', (e: Event) => {
    if (forceQuit) {
      tray.destroy();
      mainWindow = null;
      tray = null;
      app.quit();
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.hide();
};

app.on('ready', init);

app.on('before-quit', () => {
  forceQuit = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    init();
  } else {
    mainWindow.show();
  }
});
