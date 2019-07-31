import {
  readCustomMockData,
  writeCustomMockData,
  resetCustomMockData,
  removeCustomMockData,
} from '../../../utils/mocker';

export default (RPC: any) => {
  const { dispatch } = RPC;

  RPC.on('read-mock-data', (args: any) => {
    readCustomMockData((data: object) => {
      dispatch('get-mock-data', data);
    });
  });

  RPC.on('save-mock-data', (args: object) => {
    writeCustomMockData(args, (data: object) => {
      dispatch('get-mock-data-done', data);
    });
  });

  RPC.on('reset-mock-data', (args: any) => {
    resetCustomMockData((data: object) => {
      dispatch('reset-mock-data-done', data);
    });
  });

  RPC.on('remove-mock-data', (args: any) => {
    removeCustomMockData((err: any) => {
      dispatch('remove-mock-data-done', err);
    });
  });
};
