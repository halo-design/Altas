import { ipcRenderer, remote } from 'electron';
const { dialog } = remote;

export default {
  test: (): void => {
    ipcRenderer.send('ipc-start');
  },

  detect: (cb: (arg: object) => void): void => {
    ipcRenderer.once('ipc-running', (event: any, arg: object) => {
      cb(arg);
    });
  }
};

export const clipboard = {
  trigger: (): void => {
    ipcRenderer.send('read-clipboard');
  },

  bind: (cb: (arg: string) => void): void => {
    ipcRenderer.on('get-clipboard-text', (event : any, arg: string) => {
      cb(arg);
    });
  },

  unbind: (): void => {
    ipcRenderer.removeAllListeners('get-clipboard-text');
  }
};

export const download = {
  trigger: (filePath: string): void => {
    ipcRenderer.send('file-download', filePath);
  },

  bind: (cb: (arg: object) => void): void => {
    ipcRenderer.on('on-download-state', (event: any, arg: object) => {
      cb(arg);
    });
  },

  unbind: (): void => {
    ipcRenderer.removeAllListeners('on-download-state');
  }
};

export const messageBox = (args: object): void => {
  ipcRenderer.send('on-dialog-message', { type: 'info', ...args });
}

// https://electronjs.org/docs/api/dialog
export const selectFile = (args: object, cb: (arg: object) => void): void => {
  dialog.showOpenDialog({
    defaultPath: '../Desktop',
    ...args
  }, cb)
}