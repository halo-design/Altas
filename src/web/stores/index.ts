import DeviceModel from './DeviceModel';
import UploadModel from './UploadModel';
import TerminalModel from './TerminalModel';
import RadarModel from './RadarModel';
import WorkStationModel from './WorkStationModel';

const createStores = () => ({
  device: new DeviceModel(),
  upload: new UploadModel(),
  terminal: new TerminalModel(),
  radar: new RadarModel(),
  workStation: new WorkStationModel(),
});

export default createStores;
