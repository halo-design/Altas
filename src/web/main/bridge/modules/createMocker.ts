import RPC from '../rpc';
const { dispatch } = RPC;

export const readMockData = (fn: Function) => {
  dispatch('read-mock-data', {});
  RPC.once('get-mock-data', (args: object) => {
    fn(args);
  });
};

export const readMockSync = () =>
  new Promise((resolve, reject) => {
    readMockData((args: object) => {
      resolve(args);
    });
  });

export const saveMockData = (data: object, fn?: Function) => {
  dispatch('save-mock-data', data);
  RPC.once('get-mock-data-done', (args: object) => {
    fn && fn(args);
  });
};

export const resetMockData = (fn?: Function) => {
  dispatch('reset-mock-data', {});
  RPC.once('reset-mock-data-done', (args: object) => {
    fn && fn(args);
  });
};

export const removeMockData = (fn?: Function) => {
  dispatch('remove-mock-data', {});
  RPC.once('remove-mock-data-done', (args: object) => {
    fn && fn(args);
  });
};
