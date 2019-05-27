const { EventEmitter } = require('events');
const { ipcMain } = require('electron');
const uuid = require('uuid');

class Server extends EventEmitter {
  constructor(win: Electron.BrowserWindow) {
    super();
    this.win = win;
    this.ipcListener = this.ipcListener.bind(this);

    if (this.destroyed) {
      return;
    }

    const uid = uuid.v4();
    this.id = uid;

    ipcMain.on(uid, this.ipcListener);

    this.wc.on('did-finish-load', () => {
      this.wc.send('init', uid);
    });
  }

  get wc() {
    return this.win.webContents;
  }

  ipcListener(event: any, { ev, data }: { ev: any; data: any }) {
    super.emit(ev, data);
  }

  emit(ch: any, data: any) {
    if (!this.win.isDestroyed()) {
      this.wc.send(this.id, { ch, data });
    }
  }

  destroy() {
    this.removeAllListeners();
    this.wc.removeAllListeners();
    if (this.id) {
      ipcMain.removeListener(this.id, this.ipcListener);
    } else {
      this.destroyed = true;
    }
  }
}

export default (win: Electron.BrowserWindow) => {
  return new Server(win);
};
