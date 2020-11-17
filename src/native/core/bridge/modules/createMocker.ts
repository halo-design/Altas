import {
  readCustomMockData,
  writeCustomMockData,
  resetCustomMockData,
  removeCustomMockData,
} from '../../../utils/mocker';
import { sendToAllWindows } from '../../../utils/winManage';

export default (RPC: any) => {
  const { dispatch } = RPC;

  RPC.on('read-mock-data', () => {
    readCustomMockData((data: any) => {
      dispatch('get-mock-data', data);
    });
  });

  RPC.on('save-mock-data', (args: any) => {
    writeCustomMockData(args, (data: any) => {
      dispatch('get-mock-data-done', data);
      sendToAllWindows('update-mock-date', data);
    });
  });

  RPC.on('reset-mock-data', () => {
    resetCustomMockData((data: any) => {
      dispatch('reset-mock-data-done', data);
      sendToAllWindows('update-mock-date', data);
    });
  });

  RPC.on('remove-mock-data', () => {
    removeCustomMockData(() => {
      dispatch('remove-mock-data-done', '');
    });
  });
};
