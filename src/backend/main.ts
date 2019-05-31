import { app } from 'electron';
import winCreate from './core/winCreate';
import createRPC from './core/rpc';
import createBridge from './core/bridge';

let mainWindow: any;
let forceQuit: boolean = false;

const init = () => {
  mainWindow = winCreate(
    {
      height: 648,
      width: 1050,
      minWidth: 980,
      minHeight: 620,
    },
    {
      pathname: 'renderer/index.html',
      hash: '',
    }
  );

  const RPC = createRPC(mainWindow);
  const { tray } = createBridge(RPC);

  mainWindow.on('close', (e: Event) => {
    if (forceQuit) {
      tray.destroy();
      mainWindow = null;
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

require('./utils/env').supportEnv();
