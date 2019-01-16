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
  callback: (e: object) => void,
  timeout?: number,
) => {
  selectFile({
    multiSelections: false,
    properties: ['openDirectory'],
  },  (res: string[]): void => {
    const outputPath = res[0];
    let index = 0;
    let isDone = false;

    const singleDl = () => {
      const url = urls[index];
      ipcRenderer.send('file-download', url, {
        directory: outputPath || app.getPath('downloads'),
        index,
        saveAs: false,
        timeout
      });
      index++;
    }

    ipcRenderer.on('on-download-state', (event : any, params: any) => {
      const state = {
        count: urls.length,
        current: params,
        finished: params.index + 1,
      }
      const { status } = params;
      if (/(cancel|finished|error)/.test(status)) {
        if (params.index < urls.length - 1) {
          singleDl();
        } else if (!isDone) {
          callback(state);
          ipcRenderer.removeAllListeners('on-download-state');
          isDone = true;
        }
      } else {
        onProgess(state);
      }
    });

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

export const readTxtByLine = (filePath: string, readFn: (e: object) => void) => {
  ipcRenderer.send('read-text', filePath);
  ipcRenderer.on('get-text-line', (event : any, params: any) => {
    readFn(params);
    if (params.status === 'done') {
      ipcRenderer.removeAllListeners('get-text-line');
    }
  });
}

export const aesEncode = (data: string, pswd: string, iv: string, callback: (e: string) => void): void => {
  ipcRenderer.send('aes-encode', { data, pswd, iv });
  ipcRenderer.once('get-aes-encode', (event : any, params: string) => {
    callback(params);
  })
}

export const aesDecode = (data: string, pswd: string, iv: string, callback: (e: string) => void): void => {
  ipcRenderer.send('aes-decode', { data, pswd, iv });
  ipcRenderer.once('get-aes-decode', (event : any, params: string) => {
    callback(params);
  })
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
