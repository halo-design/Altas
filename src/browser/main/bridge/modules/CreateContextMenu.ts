import { remote } from 'electron';
const { Menu, MenuItem, getCurrentWindow } = remote;

export default class CreateContextMenu {
  public menu: any = null;
  public target: Window | HTMLElement = window;

  constructor(target: Window | HTMLElement, settings: Array<any>) {
    this.init = this.init.bind(this);
    const menu = new Menu();
    settings.forEach((item: any) => {
      menu.append(new MenuItem(item));
    });

    this.menu = menu;
    this.target = target;
    if (target) {
      target.addEventListener('contextmenu', this.init, false);
    }
  }

  public init(e: any) {
    e.preventDefault();
    this.menu.popup(getCurrentWindow() as any);
  }

  public unbind() {
    if (this.target) {
      this.target.removeEventListener('contextmenu', this.init);
    }
  }
}
