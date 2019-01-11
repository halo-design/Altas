import { ipcRenderer, remote } from 'electron';
const { dialog, Menu, MenuItem, getCurrentWindow } = remote;

export const detect = (cb: (args: object) => void): void => {
  ipcRenderer.send('ipc-start');
  ipcRenderer.once('ipc-running', (event: any, args: object) => {
    cb(args);
  });
}

export const readClipboard = (cb: (args: string) => void): void => {
  ipcRenderer.send('read-clipboard');
  ipcRenderer.once('get-clipboard-text', (event : any, args: string) => {
    cb(args);
  });
}

export const getIpAddress = (cb: (args: string) => void): void => {
  ipcRenderer.send('get-ip-address');
  ipcRenderer.once('ip-address', (event : any, args: string) => {
    cb(args);
  });
}

export const writeClipboard = (txt: string) => {
  ipcRenderer.send('write-clipboard', txt);
}

export const download = (url: string, args: object, cb: (args: object) => void): void => {
  ipcRenderer.send('file-download', url, args);
  ipcRenderer.on('on-download-state', (event : any, params: any) => {
    if (params.status === 'cancel' || params.status === 'finished' || params.status === 'error') {
      ipcRenderer.removeAllListeners('on-download-state');
    }
    cb(params);
  });
}

// https://www.npmjs.com/package/electron-better-dialog
export const messageBox = (args: object): void => {
  ipcRenderer.send('on-dialog-message', { type: 'info', ...args });
}

// https://electronjs.org/docs/api/dialog
export const selectFile = (args: object, cb: (args: object) => void): void => {
  dialog.showOpenDialog({
    defaultPath: '../Desktop',
    ...args
  }, cb)
}

export class CreateContextMenu {
  public menu: any = null;
  public target: Window | HTMLHtmlElement = window;

  constructor (target: Window | HTMLHtmlElement, settings: Array<{}>) {
    this.init = this.init.bind(this);
    const menu = new Menu();
    settings.forEach((item: object) => {
      menu.append(new MenuItem(item));
    })

    this.menu = menu;
    this.target = target;
    target.addEventListener('contextmenu', this.init, false);
  }

  public init (e: any) {
    e.preventDefault();
    this.menu.popup(getCurrentWindow() as any);
  }

  public unbind () {
    this.target.removeEventListener('contextmenu', this.init);
  }
}
