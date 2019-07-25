import * as path from 'path';
import { app, dialog } from 'electron';
import file from '../../utils/file';
import DL from 'electron-dl';
import log from 'electron-log';
import { appCacheFullPath } from '../constants';
import { saveFile } from '../../utils/file';
import mdTpl from '../../utils/mdTemplate';

export default (RPC: any) => {
  const { dispatch, win } = RPC;

  RPC.on('read-local-file', () => {
    dialog.showOpenDialog(
      {
        defaultPath: app.getPath('documents'),
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

  RPC.on('markdown-save-as-html', ({ title, content, outputPath }: any) => {
    const buf = Buffer.from(mdTpl(title, content), 'utf8');
    saveFile(outputPath, buf).then(() => {
      dispatch('markdown-save-as-html-done', { outputPath });
    });
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
      directory: appCacheFullPath,
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

  win.on('closed', (e: Event) => {
    timer && clearTimeout(timer);
    dlItem && dlItem.getState() === 'progressing' && dlItem.cancel();
    win.removeAllListeners();
  });
};
