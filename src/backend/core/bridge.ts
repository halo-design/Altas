import { clipboard } from 'electron';
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

export default (RPC: IServer) => {
  const { dispatch, win } = RPC;
  const windowContainer = {};

  let tray: any = null;

  if (win) {
    tray = createAppTray(RPC);
    tray.setToolTip('Altas');

    RPC.on('set-tray-title', (args: any) => {
      tray.setTitle(args);
    });

    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show();
    });
  }

  RPC.on('get-appdir', () => {
    dispatch('appdir', file.root);
  });

  RPC.on('write-storage', ({ key, data }: { key: string; data: object }) => {
    storage.set(key, data, (err: any) => {
      if (err) {
        throw err;
      } else {
        log.info(data);
        log.info(`[${key}]：数据已写入`);
      }
    });
  });

  RPC.on('read-storage', (key: string) => {
    storage.get(key, (err, data) => {
      dispatch('get-storage', data);
    });
  });

  RPC.on('remove-storage', (key: string) => {
    storage.remove(key, err => {
      log.error(err);
    });
    log.info(`[${key}]：数据已删除`);
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
        log.debug(dl.getSavePath());
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

  return { tray };
};
