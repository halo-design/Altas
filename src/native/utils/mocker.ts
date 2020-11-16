import file from '../utils/file';
import log from 'electron-log';
const Store = require('electron-store');

const defaultMockPath: string = 'renderer/public/json/mocker.json';
const mockKey = 'user-custom-chetach-simulator-mock-data';
const store = new Store();

export const readDefaultMockData = () => file.file2JSON(defaultMockPath);

export const writeCustomMockData = (data: any, fn?: (e: any) => void) => {
  store.set(mockKey, data);
  fn && fn(data);
  log.info(`[写入自定义mock参数]: ${JSON.stringify(data)}`);
};

export const readCustomMockData = (fn: (e: any) => void) => {
  const data = store.get(mockKey);
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

export const removeCustomMockData = (fn?: () => void) => {
  store.delete(mockKey);
  log.info('已删除自定义mock参数.');
  fn && fn();
};
