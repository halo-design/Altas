import DeviceModel from './DeviceModel';
import UploadModel from './UploadModel';
import TerminalModel from './TerminalModel';
import RadarModel from './RadarModel';
import WorkBenchModel from './WorkBenchModel';
import CreateServerModel from './CreateServerModel';

const createStores = () => ({
  device: new DeviceModel(),
  upload: new UploadModel(),
  terminal: new TerminalModel(),
  radar: new RadarModel(),
  workBench: new WorkBenchModel(),
  createServer: new CreateServerModel(),
});

export default createStores;
