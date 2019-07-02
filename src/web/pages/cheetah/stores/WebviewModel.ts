import * as qs from 'qs';
import * as uuid from 'uuid';
import { action, observable, computed } from 'mobx';
import interaction from '../utils/interaction';
import * as reg from '../../../constants/Reg';
const options: any = qs.parse(location.hash.substr(1));

export default class WebviewModel {
  @observable public webviewList: any[] = [];
  @observable public directive: object = {};
  @observable public focusIndex: number = 0;
  @observable public showLinkBar: boolean = false;

  @action
  public toogleLinkBar() {
    this.showLinkBar = !this.showLinkBar;
  }

  @action
  public webviewCreater(url: string, params?: object) {
    const src = params ? url + '?' + qs.stringify(params) : url;
    const {
      preload,
      descriptors: {
        userAgent,
        viewport: { width, height },
      },
    } = options;

    const webviewItem = {
      attr: {
        style: {
          width: width + 'px',
          height: height - 40 + 'px',
        },
        preload,
        useragent: userAgent,
        src,
      },
      devtools: false,
      uid: uuid.v4(),
      dom: null,
      ready: false,
    };

    return webviewItem;
  }

  @computed get webviewCount() {
    return this.webviewList.length;
  }

  @computed get maxIndex() {
    return this.webviewList.length - 1;
  }

  @computed get focusOnFisrt() {
    return this.focusIndex === 0;
  }

  @computed get focusOnLast() {
    return this.focusIndex === this.webviewList.length - 1;
  }

  @computed get focusDevtoolsState() {
    if (this.webviewCount > 0) {
      return this.webviewList[this.focusIndex].devtools;
    } else {
      return false;
    }
  }

  @computed get focusWebviewUrl() {
    if (this.webviewCount > 0) {
      return this.webviewList[this.focusIndex].attr.src;
    } else {
      return '';
    }
  }

  @action
  getDirective(name: string, params: any) {
    this.directive = { name, params };
    console.log(this.directive);
    if (
      /createNewWebview|replaceWebview|clearAllThenCreateNewWebview/.test(name)
    ) {
      const { url, options } = params;
      this[name](url, options);
    } else if (name === 'goToAnyWebview' && !isNaN(params)) {
      this.goToAnyWebview(params);
    } else if (
      /focusToNextWebview|focusToPrevWebview|reloadFocusWebview/.test(name)
    ) {
      this[name]();
    } else {
      interaction(name, params);
    }
  }

  @action
  public createNewWebview(url: string, params?: object): number | null {
    if (!reg.url.test(url)) {
      return null;
    }
    this.closeFocusDevtools();
    if (this.focusIndex !== this.maxIndex) {
      this.webviewList.splice(
        this.focusIndex + 1,
        this.maxIndex - this.focusIndex
      );
    }
    this.webviewList.push(this.webviewCreater(url, params));
    this.focusIndex = this.maxIndex;
    return this.focusIndex;
  }

  @action
  public replaceWebview(url: string, params?: object): number | null {
    if (!reg.url.test(url)) {
      return null;
    }
    this.webviewList.pop();
    return this.createNewWebview(url, params);
  }

  @action
  public clearAllThenCreateNewWebview(url: string, params?: object) {
    if (!reg.url.test(url)) {
      return null;
    }
    this.webviewList = [];
    return this.createNewWebview(url, params);
  }

  @action
  public getWebviewDOM(index: number, el: any) {
    if (!el) {
      return;
    }
    const currnet = this.webviewList[index];
    currnet['dom'] = el;
    el.addEventListener('dom-ready', () => {
      el.insertCSS(`
        body::-webkit-scrollbar {
          width: 4px;
        }
        
        body::-webkit-scrollbar-thumb {
          background-color: rgb(220, 220, 220);
        }
        
        body::-webkit-scrollbar-track-piece {
          background-color: transparent;
        }
      `);

      el.addEventListener('devtools-closed', () => {
        currnet['devtools'] = false;
      });

      el.send('dom-ready');
      currnet['ready'] = true;
    });

    el.addEventListener('ipc-message', ({ channel, args }: any) => {
      this.getDirective(channel, args[0]);
    });
  }

  @action
  public focusToNextWebview() {
    if (this.focusIndex < this.maxIndex) {
      this.closeFocusDevtools();
      this.focusIndex++;
    }
  }

  @action
  public goToAnyWebview(count: number) {
    if (count < 0) {
      const num = Math.abs(count);
      if (this.focusIndex - num >= 0) {
        this.closeFocusDevtools();
        this.focusIndex = this.focusIndex - num;
      }
    } else if (this.focusIndex + count <= this.maxIndex) {
      this.closeFocusDevtools();
      this.focusIndex = this.focusIndex + count;
    }
  }

  @action
  public focusToPrevWebview() {
    if (this.focusIndex > 0) {
      this.closeFocusDevtools();
      this.focusIndex--;
    }
  }

  @action
  public closeFocusDevtools() {
    const current = this.webviewList[this.focusIndex];
    if (current && current.ready) {
      const dom = current.dom;
      dom.closeDevTools();
      current.devtools = false;
    }
  }

  @action
  public debugFocusWebview() {
    const current = this.webviewList[this.focusIndex];
    if (current && current.ready) {
      const dom = current.dom;
      current.devtools ? dom.closeDevTools() : dom.openDevTools();
      current.devtools = !current.devtools;
    }
  }

  @action
  public reloadFocusWebview() {
    const current = this.webviewList[this.focusIndex];
    if (current && current.ready) {
      const dom = current.dom;
      dom.reloadIgnoringCache();
    }
  }
}
