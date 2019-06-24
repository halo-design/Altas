import * as path from 'path';
import { app, dialog } from 'electron';
import file from '../../utils/file';
import DL from 'electron-dl';
import log from 'electron-log';

export default (RPC: any) => {
  const { dispatch, win } = RPC;

  RPC.on('read-local-file', () => {
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
          dispatch('get-local-file-content', {
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
  RPC.on('download-preview-file', ({ url }: any) => {
    const createTimer = () => {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        if (dlItem && dlItem.getState() === 'progressing') {
          dlItem.cancel();
          log.error(url + '[下载超时，已取消]');
          dispatch('download-preview-file-result', {
            result: 'timeout',
            content: '',
          });
        }
      }, 3000);
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
          dispatch('download-preview-file-result', {
            result: dl.getState(),
            content: file.read(dl.getSavePath()),
          });
        }
      })
      .catch(() => {
        timer && clearTimeout(timer);
        dispatch('download-preview-file-result', {
          result: dlItem.getState(),
          content: '',
        });
      });
  });

  win.on('close', (e: Event) => {
    log.info('当前子窗口关闭！');
    timer && clearTimeout(timer);
    dlItem && dlItem.getState() === 'progressing' && dlItem.cancel();
    win.removeAllListeners();
  });
};
