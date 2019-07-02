import Radar from '../utils/radar';

export default class DeviceModel extends Radar {
  constructor() {
    super();
  }

  public hide() {
    if (this.containerEl) {
      this.containerEl.classList.add('hide');
    } else {
      this.afterReady = () => {
        this.containerEl && this.containerEl.classList.add('hide');
      };
    }
  }

  public show() {
    if (this.containerEl) {
      this.containerEl.classList.remove('hide');
    } else {
      this.afterReady = () => {
        this.containerEl && this.containerEl.classList.remove('hide');
      };
    }
  }
}
