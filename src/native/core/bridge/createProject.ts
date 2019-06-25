import DL from 'electron-dl';
import log from 'electron-log';
import * as fs from 'fs-extra';
import * as path from 'path';
import { appCacheFullPath } from '../constants';

export default (RPC: any) => {
  const { dispatch, win } = RPC;

  RPC.on('create-project', (args: any) => {
    const optputDir = path.join(args.projectPath, args.projectName);
    log.info(args);
    const url = 'http://owlaford.gitee.io/media/demo/vue-basic.zip';
    if (!win) {
      return;
    }
    DL.download(win, url, {
      directory: appCacheFullPath,
      onProgress: e => {
        dispatch('get-repo', {
          step: 'download',
          status: 'running',
          state: {
            progress: e,
          },
        });
      },
    })
      .then((dl: any) => {
        const tempFileSavePath = dl.getSavePath();
        dispatch('get-repo', {
          step: 'download',
          status: 'finished',
          state: {
            progress: 1,
          },
        });

        if (fs.existsSync(optputDir)) {
          dispatch('get-repo', {
            step: 'unzip',
            status: 'error',
            state: {
              errorText: '该文件夹已存在，无法完成解压！',
              optputDir,
              fileIndex: 0,
              fileCount: 0,
            },
          });
          return;
        }

        const DecompressZip = require('decompress-zip');
        const unzipper = new DecompressZip(tempFileSavePath);

        unzipper.on('error', () => {
          dispatch('get-repo', {
            step: 'unzip',
            status: 'error',
            state: {
              errorText: '文件解压出错！',
              fileIndex: 0,
              fileCount: 0,
            },
          });
        });

        unzipper.on('progress', (fileIndex: number, fileCount: number) => {
          dispatch('get-repo', {
            step: 'unzip',
            status: 'running',
            state: {
              fileIndex,
              fileCount,
            },
          });
        });

        unzipper.on('extract', (log: any) => {
          dispatch('get-repo', {
            step: 'unzip',
            status: 'finished',
            state: {
              log,
              optputDir,
              fileIndex: 0,
              fileCount: 0,
            },
          });
        });

        unzipper.extract({
          path: optputDir,
          filter: (file: any) => file.type !== 'SymbolicLink',
        });

        log.info(optputDir);
      })
      .catch(() => {
        dispatch('get-repo', {
          step: 'download',
          status: 'error',
          state: {
            errorText: '文件下载出错！',
            progress: 0,
          },
        });
      });
  });
};
