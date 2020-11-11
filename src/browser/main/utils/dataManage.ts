import * as storage from '../bridge/modules/storage';

const dataBuff: any = {};

export const dataRead = (key: string, cb: (e: any) => void) => {
  if (dataBuff[key]) {
    cb(dataBuff[key]);
    return;
  }
  storage.read(key, (data: any) => {
    if (data[key]) {
      dataBuff[key] = data[key];
      cb(data[key]);
    } else {
      cb(null);
    }
  });
};

export const dataReadSync = (key: string) =>
  new Promise((resolve) => {
    dataRead(key, (args: any) => {
      resolve(args);
    });
  });

export const dataWrite = (key: string, data: any) => {
  storage.write(key, {
    [key]: data,
  });
  dataBuff[key] = data;
};

export const dataRemove = (key: string) => {
  storage.remove(key);
  dataBuff[key] = undefined;
};
