import DeviceModel from '../models/DeviceModel';
import UploadModel from '../models/UploadModel';
import TerminalModel from '../models/TerminalModel';
import RadarModel from '../models/RadarModel';

const stores = {
  device: new DeviceModel(),
  upload: new UploadModel(),
  terminal: new TerminalModel(),
  radar: new RadarModel(),
};

export default stores;
