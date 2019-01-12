import { ipcRenderer, remote } from 'electron';
const { app, dialog, Menu, MenuItem, getCurrentWindow } = remote;

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
    const { status } = params;
    if (/(cancel|finished|error)/.test(status)) {
      ipcRenderer.removeAllListeners('on-download-state');
    }
    cb(params);
  });
}

export const multiDownload = (
  urls: string[],
  onProgess: (e: object) => void,
  callback: (e: object) => void
) => {
  selectFile({
    multiSelections: false,
    properties: ['openDirectory'],
  },  (res: string[]): void => {
    const outputPath = res[0];
    let index = 0;
    let isDone = false;

    const singleDl = () => {
      ipcRenderer.send('file-download', urls[index], {
        directory: outputPath || app.getPath('downloads'),
        saveAs: false,
      })
      ipcRenderer.on('on-download-state', (event : any, params: any) => {
        const state = {
          count: urls.length,
          current: params,
          finished: index + 1,
          url: urls[index],
        }
        const { status } = params;
        if (/(cancel|finished|error)/.test(status)) {
          if (index < urls.length - 1) {
            index++;
            singleDl();
          } else if (!isDone) {
            callback(state);
            ipcRenderer.removeAllListeners('on-download-state');
            isDone = true;
          }
        } else {
          onProgess(state);
        }
      })
    }
    singleDl();
  });
}

// https://www.npmjs.com/package/electron-better-dialog
export const messageBox = (args: object): void => {
  ipcRenderer.send('on-dialog-message', { type: 'info', ...args });
}

// https://electronjs.org/docs/api/dialog
export const selectFile = (args: object, cb: (e: string[]) => void): void => {
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
