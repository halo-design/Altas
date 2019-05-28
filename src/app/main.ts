import { app } from 'electron';
import winCreate from './core/winCreate';
import createRPC from './core/rpc';
import createBridge from './core/bridge';

let mainWindow: any;
let forceQuit: boolean = false;

const init = () => {
  mainWindow = winCreate(
    {
      height: 620,
      width: 980,
    },
    'renderer/index.html'
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
