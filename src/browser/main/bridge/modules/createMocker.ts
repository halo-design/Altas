import RPC from '../rpc';
const { dispatch } = RPC;

export const readMockData = (fn: (e: any) => void) => {
  dispatch('read-mock-data', {});
  RPC.once('get-mock-data', (args: any) => {
    fn(args || {});
  });
};

export const readMockSync = () =>
  new Promise((resolve) => {
    readMockData((args: any) => {
      resolve(args);
    });
  });

export const saveMockData = (data: any, fn?: (e: any) => void) => {
  dispatch('save-mock-data', data);
  RPC.once('get-mock-data-done', (args: any) => {
    fn && fn(args || {});
  });
};

export const resetMockData = (fn?: (e: any) => void) => {
  dispatch('reset-mock-data', {});
  RPC.once('reset-mock-data-done', (args: any) => {
    fn && fn(args || {});
  });
};

export const removeMockData = (fn?: (e: any) => void) => {
  dispatch('remove-mock-data', {});
  RPC.once('remove-mock-data-done', (args: any) => {
    fn && fn(args || {});
  });
};
