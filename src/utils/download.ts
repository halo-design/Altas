import { ipcRenderer, remote } from 'electron';
import { selectFile } from './file';
const { app } = remote;

export const download = (
  url: string,
  cb: (args: object) => void,
  args?: object
): void => {
  ipcRenderer.send('file-download', url, args || {});
  ipcRenderer.on('on-download-state', (event: any, params: any) => {
    const { status } = params;
    if (/(cancel|finished|error)/.test(status)) {
      ipcRenderer.removeAllListeners('on-download-state');
    }
    cb(params);
  });
};

export const cancelDownloadTask = (): void => {
  ipcRenderer.send('file-download-cancel');
};

export interface IMultiDownloadOptions {
  urls: string[];
  onProgess?: (e: object) => void;
  callback?: (e: object) => void;
  timeout?: number;
}

export class MultiDownload {
  public opts: IMultiDownloadOptions = { urls: [] };
  public outputPath: string = '';
  public index: number = 0;
  public isDone: boolean = false;
  public dowloadQueueStatus: string = 'downloading';

  constructor(options: IMultiDownloadOptions) {
    this.opts = options;
    this.saveFolder().then(res => {
      this.loopDownload();
    });
  }

  public cancelAll() {
    this.dowloadQueueStatus = 'stop';
    cancelDownloadTask();
  }

  public pause() {
    this.dowloadQueueStatus = 'pause';
  }

  public resume() {
    if (this.dowloadQueueStatus === 'pause') {
      this.dowloadQueueStatus = 'downloading';
      this.loop();
    }
  }

  protected saveFolder() {
    return new Promise((resolve, reject) => {
      selectFile(
        {
          buttonLabel: '确定',
          multiSelections: false,
          properties: ['openDirectory'],
          title: '选择下载目录',
        },
        (res: string[] | undefined): void => {
          if (res) {
            this.outputPath = res[0];
            resolve(res[0]);
          } else {
            reject();
          }
        }
      );
    });
  }

  protected loop() {
    const dlStatus = this.dowloadQueueStatus;
    if (/(stop|pause)/.test(dlStatus)) {
      return;
    }

    const url = this.opts.urls[this.index];
    ipcRenderer.send('file-download', url, {
      directory: this.outputPath || app.getPath('downloads'),
      index: this.index,
      saveAs: false,
      timeout: this.opts.timeout,
    });
    this.index++;
  }

  protected loopDownload() {
    this.loop();
    ipcRenderer.on('on-download-state', (event: any, params: any) => {
      const state = {
        count: this.opts.urls.length,
        current: params,
        finished: params.index + 1,
      };

      const { status } = params;
      if (/(cancel|finished|error)/.test(status)) {
        if (
          params.index < this.opts.urls.length - 1 &&
          this.dowloadQueueStatus !== 'stop'
        ) {
          this.loop();
        } else if (!this.isDone) {
          if (this.opts.callback) {
            this.opts.callback(state);
          }
          ipcRenderer.removeAllListeners('on-download-state');
          this.isDone = true;
        }
      } else {
        if (this.opts.onProgess) {
          this.opts.onProgess(state);
        }
      }
    });
  }
}
