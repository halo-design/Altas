import { ipcRenderer, remote } from 'electron';
import { selectFile } from './file';
const { app } = remote;

export const download = (
  url: string,
  cb: (args: object) => void,
  args?: object,
): void => {
  ipcRenderer.send('file-download', url, args || {});
  ipcRenderer.on('on-download-state', (event : any, params: any) => {
    const { status } = params;
    if (/(cancel|finished|error)/.test(status)) {
      ipcRenderer.removeAllListeners('on-download-state');
    }
    cb(params);
  });
}

let cancelDL: boolean = false;
export const cancelMultiDownload = (): void => {
  ipcRenderer.send('file-download-cancel');
  cancelDL = true;
}

export const multiDownload = (
  urls: string[],
  onProgess: (e: object) => void,
  callback: (e: object) => void,
  timeout?: number,
) => {
  selectFile({
    buttonLabel: '确定',
    multiSelections: false,
    properties: ['openDirectory'],
    title: '选择下载目录',
  },  (res: string[] | undefined): void => {
    if (!res) {
      return
    }

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
      if (cancelDL) {
        cancelDL = false;
        return
      }

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

