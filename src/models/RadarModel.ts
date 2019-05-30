import Radar from '../utils/radar';

export default class DeviceModel extends Radar {
  constructor() {
    super();
  }

  public hide() {
    if (this.containerEl) {
      this.containerEl.style.display = 'none';
    }
  }

  public show() {
    if (this.containerEl) {
      this.containerEl.style.display = 'block';
    }
  }
}
