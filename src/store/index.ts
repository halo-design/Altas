import DeviceModel from '../models/DeviceModel';
import UploadModel from '../models/UploadModel';
import TerminalModel from '../models/TerminalModel';

const stores = {
  device: new DeviceModel(),
  upload: new UploadModel(),
  terminal: new TerminalModel(),
};

export default stores;
