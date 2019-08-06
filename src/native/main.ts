import { app } from 'electron';
import winCreater from './utils/winCreater';
import createRPC from './core/rpc';
import createBridge from './core/bridge/main';
import { showBetterMessageBox } from 'electron-better-dialog';

let mainWindow: any;
let forceQuit: boolean = false;
let restartTimer: any = null;

const init = () => {
  require('./core/preload');

  mainWindow = winCreater(
    {
      height: 620,
      width: 980,
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
      mainWindow.removeAllListeners();
      mainWindow = null;
      app.quit();
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('unresponsive', () => {
    restartTimer = setTimeout(() => {
      showBetterMessageBox(
        mainWindow,
        {
          message: '您的应用长时间未响应，是否重新启动？',
          betterButtons: [
            {
              label: '是',
              isDefault: true,
            },
            {
              label: '否',
              isCancel: true,
            },
          ],
        },
        (response: any) => {
          if (response.isDefault) {
            app.relaunch();
            app.exit(0);
          }
        }
      );
      clearTimeout(restartTimer);
    }, 30 * 1000);
  });

  mainWindow.on('responsive', () => {
    clearTimeout(restartTimer);
  });

  if (!app.isPackaged) {
    require('devtron').install();
  }
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
