import log from 'electron-log';
import { clipboard } from 'electron';
import * as storage from 'electron-json-storage';
import readTxtByLine from '../../utils/readTxtByLine';
import file from '../../utils/file';

export default (RPC: any) => {
  const { dispatch } = RPC;

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

  RPC.on('remove-file', (url: string) => {
    file.del(url);
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

  RPC.on('read-clipboard', () => {
    dispatch('get-clipboard-text', clipboard.readText());
  });

  RPC.on('write-clipboard', (args: string) => {
    clipboard.writeText(args);
  });
};
