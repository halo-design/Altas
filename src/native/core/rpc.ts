import { EventEmitter } from 'events';
import { ipcMain } from 'electron';
import * as uuid from 'uuid';

export interface IServer {
  dispatch: (ch: any, data: any) => void;
  destroy: () => void;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  wc: Electron.webContents | null;
  win: Electron.BrowserWindow | null;
  destroyed: boolean;
  id: string;
}

export class Server extends EventEmitter {
  public win: Electron.BrowserWindow | null = null;
  public destroyed: boolean = false;
  public id: string = '';

  constructor(win: Electron.BrowserWindow) {
    super();
    this.win = win;
    this.ipcListener = this.ipcListener.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.destroy = this.destroy.bind(this);

    if (this.destroyed) {
      return;
    }

    const uid = uuid.v4();
    this.id = uid;

    ipcMain.on(uid, this.ipcListener);

    if (this.wc) {
      this.wc.on('did-finish-load', () => {
        this.wc && this.wc.send('init', uid);
      });
    }
  }

  get wc() {
    if (this.win) {
      return this.win.webContents;
    } else {
      return null;
    }
  }

  private ipcListener(event?: any, params?: any): void {
    const { ev, data }: { ev: string; data: any } = params;
    super.emit(ev, data);
  }

  public dispatch(ch: any, data: any) {
    if (this.win && !this.win.isDestroyed()) {
      this.wc && this.wc.send(this.id, { ch, data });
    }
  }

  public destroy() {
    this.removeAllListeners();
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
