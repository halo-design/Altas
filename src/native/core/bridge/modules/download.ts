import DL from 'electron-dl';
import log from 'electron-log';

export default (RPC: any) => {
  const { dispatch, win } = RPC;

  let dlItem: any;
  RPC.on('file-download', ({ url, args }: { url: string; args: any }) => {
    let timer: any;

    const createTimer = () => {
      const { timeout } = args;
      if (timeout) {
        timer = setTimeout(() => {
          if (dlItem && dlItem.getState() === 'progressing') {
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
      onProgress: (e: any) => {
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
      onStarted: (e: any) => {
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
      .then((dl: any) => {
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
    if (dlItem && dlItem.getState() === 'progressing') {
      dlItem.cancel();
    }
  });
};
