import * as qs from 'qs';
import * as url from 'url';
import * as uuid from 'uuid';
import { action, observable, computed } from 'mobx';
import interaction from '../utils/interaction';
import { urlTest } from '../../../main/constants/Reg';
import { scrollbarStyleString } from '../../../main/constants/API';
const options: any = qs.parse(location.hash.substr(1));

export default class WebviewModel {
  @observable public webviewList: any[] = [];
  @observable public directive: object = {};
  @observable public focusIndex: number = 0;
  @observable public showLinkBar: boolean = false;

  constructor() {
    this.focusWebviewSender = this.focusWebviewSender.bind(this);
  }

  @action
  public toogleLinkBar() {
    this.showLinkBar = !this.showLinkBar;
  }

  @action
  public webviewCreater(lnk: string, params?: object) {
    const src = params ? lnk + '?' + qs.stringify(params) : lnk;
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
      spinner: false,
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

  @computed get focusWebviewHost() {
    if (this.focusWebviewUrl) {
      const { host, protocol } = url.parse(this.focusWebviewUrl);
      return url.format({ host, protocol });
    } else {
      return url.format({ hostname: 'localhost', protocol: 'http' });
    }
  }

  @computed get focusWebviewSpinner() {
    if (this.webviewCount > 0) {
      return this.webviewList[this.focusIndex].spinner;
    } else {
      return false;
    }
  }

  @action
  public focusWebviewSender(name: string, params: object) {
    this.webviewList[this.focusIndex].dom.send(name, params);
  }

  @action
  getDirective(name: string, params: any) {
    this.directive = { name, params };
    if (
      /createNewWebview|replaceWebview|clearAllThenCreateNewWebview/.test(name)
    ) {
      const { url, options } = params;
      this[name](url, options);
    } else if (name === 'goToAnyWebview' && !isNaN(params)) {
      this.goToAnyWebview(params);
    } else if (
      /focusToNextWebview|focusToPrevWebview|reloadFocusWebview|clearWebviewHistory|clearOtherWebviews/.test(
        name
      )
    ) {
      this[name]();
    } else {
      interaction(name, params, this.focusWebviewSender);
    }
  }

  public formatUrl(lnk: string) {
    return lnk.indexOf('/') === 0
      ? url.resolve(this.focusWebviewHost, lnk)
      : lnk;
  }

  @action
  public testUrl(lnk: string) {
    const isBlank = lnk === 'about:blank';
    const isLocal = lnk.indexOf('http://localhost') > -1;
    if (isBlank) {
      this.showLinkBar = true;
    }
    return urlTest(lnk) || isBlank || isLocal;
  }

  @action
  public createNewWebview(lnk: string, params?: object, force?: boolean) {
    const src = this.formatUrl(lnk);
    if (!this.testUrl(src) && !force) {
      return;
    }
    this.closeFocusDevtools();
    if (this.focusIndex !== this.maxIndex) {
      this.webviewList.splice(
        this.focusIndex + 1,
        this.maxIndex - this.focusIndex
      );
    }
    this.webviewList.push(this.webviewCreater(src, params));
    this.focusIndex = this.maxIndex;
  }

  @action
  public replaceWebview(lnk: string, params?: object) {
    const src = this.formatUrl(lnk);
    if (!this.testUrl(src)) {
      return;
    }
    this.webviewList[this.focusIndex] = this.webviewCreater(src, params);
  }

  @action
  public clearAllThenCreateNewWebview(lnk: string, params?: object) {
    const src = this.formatUrl(lnk);
    if (!this.testUrl(src)) {
      return;
    }
    this.webviewList = [];
    this.focusIndex = 0;
    this.createNewWebview(src, params, true);
  }

  @action
  public clearWebviewHistory() {
    this.focusIndex = 0;
    this.webviewList = this.webviewList.slice(-1);
  }

  @action
  public clearOtherWebviews() {
    this.webviewList = [this.webviewList[this.focusIndex]];
    this.focusIndex = 0;
  }

  @action
  public getWebviewDOM(index: number, el: any) {
    if (!el) {
      return;
    }
    const current = this.webviewList[index];
    current['dom'] = el;

    el.addEventListener('did-start-loading', () => {
      current['spinner'] = true;
    });

    el.addEventListener('new-window', (ev: any) => {
      this.webviewList[this.focusIndex].attr.src = ev.url;
    });

    el.addEventListener('did-stop-loading', () => {
      current['spinner'] = false;
    });

    el.addEventListener('dom-ready', () => {
      el.insertCSS(scrollbarStyleString);

      el.addEventListener('devtools-closed', () => {
        current['devtools'] = false;
      });

      el.send('dom-ready');
      current['ready'] = true;
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
