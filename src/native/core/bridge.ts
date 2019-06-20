import * as path from 'path';
import { app, clipboard, ipcMain, dialog } from 'electron';
import { IServer } from './rpc';
import file from '../utils/file';
import readTxtByLine from '../utils/readTxtByLine';
import log from 'electron-log';
import * as storage from 'electron-json-storage';
import * as ip from 'ip';
import * as os from 'os';
import * as hash from 'object-hash';
import * as crypto from '../utils/crypto';
import createAppTray from '../utils/tray';
import winCreate from './winCreate';
import { showBetterMessageBox } from 'electron-better-dialog';
import DL from 'electron-dl';
import * as uuid from 'uuid';
import { cmdIsAvailable, langIsAvailable } from '../utils/env';
import projectRunner from '../utils/projectRunner';
import * as fs from 'fs-extra';

const pkg = require('../../../package.json');

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

export default (RPC: IServer) => {
  const { dispatch, win } = RPC;
  const windowContainer = {};

  let tray: any = null;

  if (win) {
    tray = createAppTray(RPC);
    tray.setToolTip('Altas ' + pkg.version);

    RPC.on('read-app-info', () => {
      dispatch('get-app-info', pkg);
    });

    RPC.on('set-tray-title', (args: any) => {
      tray.setTitle(args);
    });

    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show();
    });
  }

  RPC.on('get-appdir', () => {
    dispatch('appdir', { root: file.root });
  });

  RPC.on('write-storage', ({ key, data }: { key: string; data: object }) => {
    storage.set(key, data, (err: any) => {
      if (err) {
        throw err;
      } else {
        log.info(data);
        log.info(`[${key}]：写入数据.`);
      }
    });
  });

  RPC.on('read-storage', (key: string) => {
    storage.get(key, (err, data) => {
      log.info(`[${key}]：读取数据.`);
      dispatch('get-storage' + key, data);
    });
  });

  RPC.on('remove-storage', (key: string) => {
    storage.remove(key, err => {
      log.error(err);
    });
    log.info(`[${key}]：删除数据.`);
  });

  RPC.on('on-dialog-message', (args: any) => {
    win && showBetterMessageBox(win, args);
  });

  RPC.on('read-text', (args: string) => {
    readTxtByLine(
      args,
      (index: number, line: string) => {
        const params = { index, line, status: 'pending' };
        dispatch('get-text-line', params);
      },
      () => {
        dispatch('get-text-line', { status: 'done' });
      }
    );
  });

  let dlItem: any;
  RPC.on('file-download', ({ url, args }: { url: string; args: any }) => {
    let timer: any;

    const createTimer = () => {
      const { timeout } = args;
      if (timeout) {
        timer = setTimeout(() => {
          if (dlItem) {
            dlItem.cancel();
            log.error(url + '[下载超时，已取消]');
          }
        }, timeout);
      }
    };

    if (!win) {
      return;
    }

    DL.download(win, url, {
      onCancel: () => {
        if (timer) {
          clearTimeout(timer);
        }
        dispatch('on-download-state', {
          index: args.index || 0,
          progress: 0,
          status: 'cancel',
        });
      },
      onProgress: e => {
        if (timer) {
          clearTimeout(timer);
        }
        createTimer();
        dispatch('on-download-state', {
          index: args.index || 0,
          progress: e,
          status: 'running',
        });
      },
      onStarted: e => {
        dlItem = e;
        createTimer();
        dispatch('on-download-state', {
          index: args.index || 0,
          progress: 0,
          status: 'start',
        });
      },
      ...args,
    })
      .then(dl => {
        if (timer) {
          clearTimeout(timer);
        }
        log.info(dl.getSavePath());
        dispatch('on-download-state', {
          index: args.index || 0,
          progress: 1,
          status: 'finished',
        });
      })
      .catch(() => {
        if (timer) {
          clearTimeout(timer);
        }
        dispatch('on-download-state', {
          index: args.index || 0,
          progress: 0,
          status: 'error',
        });
      });
  });

  RPC.on('file-download-cancel', () => {
    if (dlItem) {
      dlItem.cancel();
    }
  });

  RPC.on('read-clipboard', () => {
    dispatch('get-clipboard-text', clipboard.readText());
  });

  RPC.on('write-clipboard', (args: string) => {
    clipboard.writeText(args);
  });

  RPC.on('get-ip-address', () => {
    const network = {
      ip: '',
    };
    network.ip = ip.address();
    dispatch('ip-address', network);
  });

  RPC.on('get-device-os', () => {
    const deviceInfo = {
      arch: os.arch(),
      cpu: os.cpus(),
      homedir: os.homedir(),
      hostname: os.hostname(),
      memory: os.totalmem(),
      network: os.networkInterfaces(),
      platform: os.platform(),
      release: os.release(),
      tmpdir: os.tmpdir(),
      type: os.type(),
      uptime: os.uptime(),
      userInfo: os.userInfo(),
    };
    dispatch('device-os', deviceInfo);
  });

  RPC.on('aes-encode', (args: any) => {
    const mdString = hash.MD5(args.pswd);
    const key = mdString.slice(0, 16);
    const iv = mdString.slice(16);
    dispatch('get-aes-encode', crypto.aseEncode(args.data, key, iv));
  });

  RPC.on('aes-decode', (args: any) => {
    const mdString = hash.MD5(args.pswd);
    const key = mdString.slice(0, 16);
    const iv = mdString.slice(16);
    dispatch('get-aes-decode', crypto.aseDecode(args.data, key, iv));
  });

  RPC.on('create-window', (args: any) => {
    if (!win) {
      return;
    }
    const childWin = winCreate(args.options, args.entry, win, true);
    const uid = uuid.v4();
    windowContainer[uid] = childWin;
    dispatch('get-window-id', { win_uid: uid });
  });

  RPC.on('close-window', (args: any) => {
    if (args.uid in windowContainer) {
      const targetWin = windowContainer[args.uid];
      if (!targetWin.isDestroyed()) {
        targetWin.close();
      }
    }
  });

  RPC.on('detect-support-env', (args: any) => {
    const es = [
      {
        name: 'Node.js',
        icon_name: 'node',
        version: cmdIsAvailable('node -v'),
        download_lnk: 'http://nodejs.cn/download/',
      },
      {
        name: 'NPM',
        icon_name: 'npm',
        version: cmdIsAvailable('npm -v'),
        download_lnk: 'http://caibaojian.com/npm/all.html',
      },
      {
        icon_name: 'vue',
        name: 'Vue CLI',
        version: cmdIsAvailable('vue -V'),
        download_lnk: 'https://cli.vuejs.org/zh/guide/prototyping.html',
      },
      {
        icon_name: 'yarn',
        name: 'Yarn',
        version: cmdIsAvailable('yarn -v'),
        download_lnk: 'https://yarn.bootcss.com/docs/install/',
      },
      {
        name: 'Python',
        icon_name: 'python',
        version: langIsAvailable('python', ['-V']),
        download_lnk: 'https://www.python.org/getit/',
      },
    ];

    dispatch('get-support-env', { env_support: es });
  });

  RPC.on('create-project', (args: any) => {
    const optputDir = path.join(args.projectPath, args.projectName);
    log.info(args);
    const url = 'http://owlaford.gitee.io/media/demo/vue-basic.zip';
    if (!win) {
      return;
    }
    DL.download(win, url, {
      directory: app.getPath('temp'),
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

  RPC.on('detect-runner-config', (args: any) => {
    const { projectPath } = args;
    if (projectPath) {
      const config = projectRunner(projectPath);
      dispatch('get-runner-config', config);
    }
  });

  RPC.on('detect-process-pid', (args: any) => {
    if (os.platform() === 'darwin') {
      const exec = require('child_process').exec;
      exec('ps -ax | grep node', (err: any, stdout: string) => {
        if (err) {
          return;
        }
        const pidList: string[] = [];
        stdout.split('\n').filter((line: string) => {
          if (line.indexOf(path.basename(args.dirname)) >= 0) {
            const col = line.trim().split(/\s+/);
            pidList.push(col[0]);
          }
        });
        dispatch('get-process-pid', { pidList });
      });
    }
  });

  return { tray };
};
