import * as path from 'path';
import { BrowserWindow } from 'electron';
import { app, ipcMain, dialog } from 'electron';
import file from '../../utils/file';
import DL from 'electron-dl';
import log from 'electron-log';

export default (RPC: any) => {
  const win = BrowserWindow.getFocusedWindow() || RPC.win;

  ipcMain.on('read-local-file', (event: any) => {
    dialog.showOpenDialog(
      {
        defaultPath: app.getPath('home'),
        buttonLabel: '打开',
        properties: ['openFile'],
        filters: [
          {
            name: '*',
            extensions: ['md', 'markdown'],
          },
        ],
        title: '选择要预览的markdown文件',
      },
      (filepath: string[] | undefined) => {
        if (filepath && filepath[0]) {
          const fpath = filepath[0];
          const content = file.read(fpath);
          event.sender.send('get-local-file-content', {
            directory: path.join(fpath, '../'),
            content,
            filepath: fpath,
          });
        }
      }
    );
  });

  let dlItem: any;
  let timer: any;
  ipcMain.on('download-preview-file', (event: any, { url }: any) => {
    const createTimer = () => {
      timer = setTimeout(() => {
        if (dlItem && dlItem.getState() === 'progressing') {
          dlItem.cancel();
          log.error(url + '[下载超时，已取消]');
          event.sender.send('download-preview-file-result', {
            result: 'timeout',
            content: '',
          });
        }
      }, 30000);
    };

    DL.download(win, url, {
      directory: app.getPath('temp'),
      showBadge: false,
      onCancel: () => {
        timer && clearTimeout(timer);
        log.info('本次下载取消.');
      },
      onStarted: (e: any) => {
        dlItem = e;
        createTimer();
      },
      onProgress: (e: any) => {
        timer && clearTimeout(timer);
        createTimer();
      },
    })
      .then((dl: any) => {
        timer && clearTimeout(timer);
        if (dl && dl.getState()) {
          log.info(dl.getSavePath());
          if (event.sender) {
            event.sender.send('download-preview-file-result', {
              result: dl.getState(),
              content: file.read(dl.getSavePath()),
            });
          }
        }
      })
      .catch(() => {
        timer && clearTimeout(timer);
        if (event.sender) {
          event.sender.send('download-preview-file-result', {
            result: dlItem.getState(),
            content: '',
          });
        }
      });
  });

  ipcMain.on('download-preview-file-cancel', (event: any) => {
    timer && clearTimeout(timer);
    dlItem && dlItem.getState() === 'progressing' && dlItem.cancel();
  });
};
