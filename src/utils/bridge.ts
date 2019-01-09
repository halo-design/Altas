import { ipcRenderer, remote } from 'electron';
const { dialog, Menu, MenuItem, getCurrentWindow } = remote;

export default {
  test: (): void => {
    ipcRenderer.send('ipc-start');
  },

  detect: (cb: (args: object) => void): void => {
    ipcRenderer.once('ipc-running', (event: any, args: object) => {
      cb(args);
    });
  }
};

export const readClipboard = {
  trigger: (): void => {
    ipcRenderer.send('read-clipboard');
  },

  bind: (cb: (args: string) => void): void => {
    ipcRenderer.on('get-clipboard-text', (event : any, args: string) => {
      cb(args);
    });
  },

  unbind: (): void => {
    ipcRenderer.removeAllListeners('get-clipboard-text');
  }
};

export const writeClipboard = (txt: string) => {
  ipcRenderer.send('write-clipboard', txt);
}

export const download = {
  trigger: (url: string, args: object): void => {
    ipcRenderer.send('file-download', url, args);
  },

  bind: (cb: (args: object) => void): void => {
    ipcRenderer.on('on-download-state', (event : any, args: object) => {
      cb(args);
    });
  },

  unbind: (): void => {
    ipcRenderer.removeAllListeners('on-download-state');
  }
};

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
