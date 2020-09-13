import { app } from 'electron';
import winCreater from './utils/winCreater';
import createAppTray from './utils/tray';
import createRPC from './core/rpc';
import { showBetterMessageBox } from 'electron-better-dialog';
import { isMac, isWin } from './utils/env';
import inject from './core/bridge/inject';
import './core/preload';

app.commandLine.appendSwitch('remote-debugging-port', '8315');

if (isWin()) {
  app.disableHardwareAcceleration();
}

class Altas {
  public mainWin: any = null;
  public mainRPC: any = null;
  public tray: any = null;
  public forceQuit: boolean = false;
  public restartTimer: any = null;
  public unresponsiveTime: number = 30;

  public initApp() {
    this.mainWin = winCreater(
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

    this.mainRPC = createRPC(this.mainWin);

    this.initTray();
    this.initBridge();
    this.onClose();
    this.onUnresponsive();

    if (!app.isPackaged) {
      require('devtron').install();
    }
  }

  public initBridge() {
    inject(this.mainRPC, [
      'createWindow',
      'detector',
      'readWrite',
      'download',
      'crypto',
      'createProject',
      'createImageCache',
      'createServer',
    ]);
  }

  public onClose() {
    this.mainWin.on('close', (e: Event) => {
      if (this.forceQuit) {
        this.tray.destroy();
        this.mainWin.removeAllListeners();
        this.mainWin = null;
        app.quit();
      } else {
        e.preventDefault();
        this.mainWin.hide();
      }
    });
  }

  public onUnresponsive() {
    this.mainWin.on('unresponsive', () => {
      this.restartTimer = setTimeout(() => {
        showBetterMessageBox(
          this.mainWin,
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
        clearTimeout(this.restartTimer);
      }, this.unresponsiveTime * 1000);
    });

    this.mainWin.on('responsive', () => {
      clearTimeout(this.restartTimer);
    });
  }

  public initTray() {
    this.tray = createAppTray(this.mainRPC);
    this.tray.setToolTip('Altas ' + app.getVersion());

    this.mainRPC.on('set-tray-title', (args: any) => {
      this.tray.setTitle(args);
    });

    this.tray.on('click', () => {
      this.mainWin.isVisible() ? this.mainWin.hide() : this.mainWin.show();
    });
  }

  public install() {
    app.on('ready', () => {
      this.initApp();
    });

    app.on('before-quit', () => {
      this.forceQuit = true;
    });

    app.on('window-all-closed', () => {
      if (!isMac()) {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (this.mainWin === null) {
        this.initApp();
      } else {
        this.mainWin.show();
      }
    });
  }
}

new Altas().install();
