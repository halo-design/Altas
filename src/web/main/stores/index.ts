import DeviceModel from './DeviceModel';
import UploadModel from './UploadModel';
import TerminalModel from './TerminalModel';
import RadarModel from './RadarModel';
import WorkBenchModel from './workBenchModel';

const createStores = () => ({
  device: new DeviceModel(),
  upload: new UploadModel(),
  terminal: new TerminalModel(),
  radar: new RadarModel(),
  workBench: new WorkBenchModel(),
});

export default createStores;
