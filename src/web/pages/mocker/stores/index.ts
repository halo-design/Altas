import MonitorModel from './MonitorModel';

const createStores = () => ({
  monitor: new MonitorModel(),
});

export default createStores;
