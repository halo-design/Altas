import file from '../utils/file';
import log from 'electron-log';
import * as storage from 'electron-json-storage';

const defaultMockPath: string = 'renderer/public/json/mocker.json';
const mockKey = 'user-custom-chetach-simulator-mock-data';

export const readDefaultMockData = () => file.file2JSON(defaultMockPath);

export const writeCustomMockData = (data: any, fn?: (e: any) => void) => {
  storage.set(mockKey, data, (err: any) => {
    if (err) {
      log.error(err);
    } else {
      fn && fn(data);
      log.info(`[写入自定义mock参数]: ${JSON.stringify(data)}`);
    }
  });
};

export const readCustomMockData = (fn: (e: any) => void) => {
  storage.get(mockKey, (err, data) => {
    if (err) {
      log.error(err);
    } else {
      const isEmpty = Object.keys(data).length === 0;
      if (isEmpty) {
        const mockData = readDefaultMockData();
        fn(mockData);
        log.info('mock参数未自定义设置.');
        log.info(`读取默认mock参数.`);
      } else {
        fn(data);
        log.info(`读取自定义mock参数.`);
      }
    }
  });
};

export const readCustomMockDataSync = () =>
  new Promise((resolve) => {
    readCustomMockData((args: any) => {
      resolve(args);
    });
  });

export const resetCustomMockData = (fn?: (e: any) => void) => {
  const defaultData = readDefaultMockData();
  log.info('重置并写入默认mock参数.');
  writeCustomMockData(defaultData, fn);
};

export const removeCustomMockData = (fn?: (e: any) => void) => {
  storage.remove(mockKey, (err) => {
    if (err) {
      log.error(err);
    } else {
      log.info('已删除自定义mock参数.');
    }
    fn && fn(err);
  });
};
