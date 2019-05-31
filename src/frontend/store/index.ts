import DeviceModel from '../models/DeviceModel';
import UploadModel from '../models/UploadModel';
import TerminalModel from '../models/TerminalModel';
import RadarModel from '../models/RadarModel';
import WorkStationModel from '../models/WorkStationModel';

const stores = {
  device: new DeviceModel(),
  upload: new UploadModel(),
  terminal: new TerminalModel(),
  radar: new RadarModel(),
  workStation: new WorkStationModel(),
};

export default stores;
