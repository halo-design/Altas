import * as qs from 'qs';
import * as url from 'url';
import * as uuid from 'uuid';
import { action, observable, computed } from 'mobx';
import interaction from '../utils/interaction';
import { urlTest } from '../../../main/constants/Reg';
import RPC from '../../../main/bridge/rpc';
import { readMockData } from '../../../main/bridge/modules/createMocker';
import { scrollbarStyleString } from '../../../main/constants/API';
import { IRpcConfig, cheetahRpc } from '../utils/cheetah-rpc';
import { dataReadSync, dataWrite } from '../../../main/utils/dataManage';
import Toast from 'antd-mobile/lib/toast';
import {
  rpcSettings,
  rpcData,
  rpcLogin,
} from '../constants/rpc-config-default';
const options: any = qs.parse(location.hash.substr(1));
const moment = require('moment');
const EventEmitter = require('events');

interface IMenu {
  icon?: string;
  icontype?: string;
  text?: string;
  color: string;
  overrideClick?: boolean;
}

interface ITitle {
  title?: string;
  color?: string;
  img?: string;
}

export default class WebviewModel {
  @observable public webviewList: any[] = [];
  @observable public directive: any = {};
  @observable public focusIndex: number = 0;
  @observable public showLinkBar: boolean = false;
  @observable public behavior: string = 'none';

  @observable public datepickerElement: any = null;
  @observable public datepickerParams: any = {};

  @observable public pickerElement: any = null;
  @observable public pickerParams: any = {};

  @observable public triggleRefresh: boolean = false;

  // navigator bar
  @observable public serverConnectState: boolean = false;
  @observable public wsConnectState: boolean = false;
  @observable public leftMenus: IMenu[] = [];
  @observable public leftMenusVisible: boolean = true;
  @observable public rightMenus: IMenu[] = [];
  @observable public rightMenusVisible: boolean = true;
  @observable public middleTitle: ITitle = {};
  @observable public navBarBottomLineColor: string = '';
  @observable public navBarVisible: boolean = true;
  @observable public navBarMaskVisible: boolean = false;
  @observable public navBarMaskBgColor: string = '';
  @observable public navBarBgColor: string = '';
  @observable public curTime: string = moment().format('A h:mm');
  @observable public localMockData: any = {};

  // login page
  @observable public rpcSettingsVisible: boolean = false;
  @observable public loginShowState: boolean = false;
  @observable public rpcOperationType: any = {};
  @observable public sessionID: string = '';
  @observable public afterLoginRedirectUrl: string = '';
  @observable public userInfo: any = {};
  @observable public isLogined: boolean = false;

  constructor() {
    this.focusWebviewSender = this.focusWebviewSender.bind(this);
    this.setDefaultNavBar();
    this.getTime();

    this.getLocalMockData();

    RPC.mockProxyDataUpdateGlobal(() => {
      this.getLocalMockData();
    });

    RPC.mockProxyServerConnectStatusGlobal((args: any) => {
      this.setServerConnectState(args.connect);
    });

    RPC.mockProxyWsConnectStatusGlobal((args: any) => {
      this.setWsConnectState(args.connect);
    });

    this.initSettings();
  }

  @action
  public async initSettings() {
    const cheetahServerConfig: any = await dataReadSync(
      'cheetah_server_config'
    );

    // sometines lack of params
    if (Object.keys(cheetahServerConfig || {}).length >= 10) {
      this.rpcOperationType = cheetahServerConfig;
    } else {
      this.rpcOperationType = {
        ...rpcSettings,
        rpcData,
        rpcLogin,
      };
    }
  }

  @action
  public rpc(options: any, bridgeCallback: (e: any) => void, overwriteBody?: any) {
    const data = this.rpcOperationType.rpcData;
    options.headers = options.headers || {};

    if (this.sessionID) {
      eval(
        `${this.rpcOperationType.rpcOperationSessionIDPositionSend} = "${this.sessionID}"`
      );
    }

    cheetahRpc(
      this.rpcOperationType,
      options,
      bridgeCallback,
      data,
      overwriteBody,
      (params: any) => this.focusWebviewSender('bench-logger', params)
    );
  }

  @action
  public submitLogin(isRefresh?: boolean, callback?: (e: any) => void) {
    !isRefresh && Toast.loading('正在登录...', 8);
    this.rpc(
      {
        operationType: this.rpcOperationType.rpcOperationLoginInterface,
        requestData: [],
      },
      ({ error, errorMessage, resData }: any) => {
        Toast.hide();
        if (error && Number(error) !== 0) {
          Toast.fail(errorMessage || '数据请求发生错误');
        } else {
          const data = resData;

          const errMsg = eval(
            this.rpcOperationType.rpcOperationLoginErrorMsgPosition
          );

          const resultCode = eval(
            this.rpcOperationType.rpcOperationLoginErrorCodePosition
          );

          if (
            resultCode !== this.rpcOperationType.rpcOperationLoginSuccessCode
          ) {
            !isRefresh && Toast.fail(errMsg || '登录失败');
            this.isLogined = false;
          } else {
            this.userInfo = data;
            const sessionID = eval(
              this.rpcOperationType.rpcOperationSessionIDPositionReviece
            );
            this.sessionID = sessionID || '';
            if (isRefresh) {
              callback && callback(data);
              return;
            }
            this.createNewWebview(this.afterLoginRedirectUrl);
            this.afterLoginRedirectUrl = '';
            this.isLogined = true;
            this.setLogintState(false);
            this.globalWebviewSender('notify-trigger', {
              name: 'NEBULANOTIFY_loginSuccess',
              data: {},
            });
          }
        }
      },
      this.rpcOperationType.rpcLogin || {}
    );
  }

  @action
  public setRpcOperationSettings(config: IRpcConfig) {
    this.rpcOperationType = config;
    dataWrite('cheetah_server_config', config);
    Toast.success('已保存！');
  }

  @action
  public getLocalMockData() {
    if (!this.serverConnectState) {
      readMockData((args: any) => {
        this.localMockData = args.data;
      });
    }
  }

  @action
  public setLogintState(state: boolean) {
    this.loginShowState = state;
  }

  @action
  public setRpcSettingsVisible(state: boolean) {
    this.rpcSettingsVisible = state;
  }

  @action
  public setServerConnectState(state: boolean) {
    this.serverConnectState = state;
  }

  @action
  public setWsConnectState(state: boolean) {
    this.wsConnectState = state;
  }

  @action
  public getTime() {
    const timer = setTimeout(() => {
      this.curTime = moment().format('h:mm A');
      clearTimeout(timer);
      this.getTime();
    }, 60 * 1000);
  }

  @action
  public setTitle() {
    if (this.focusWebview) {
      this.middleTitle = {
        title: this.focusWebview.title,
      };
    }
  }

  @action
  public setDefaultNavBar() {
    this.leftMenus = [
      {
        icontype: 'back_black',
        text: '返回',
        color: '#333',
        overrideClick: false,
      },
    ];
  }

  @action
  public toogleRefresh(status: boolean) {
    this.triggleRefresh = status;
  }

  @action
  public toogleLinkBar() {
    this.showLinkBar = !this.showLinkBar;
  }

  @action
  public webviewCreater(lnk: string, params?: any) {
    let src = lnk;

    if (params && Object.keys(params).length > 0) {
      const { host, protocol, pathname, search } = url.parse(lnk);
      const beforeParams =
        search && search.length > 1 ? qs.parse(search.substr(1)) : {};

      src = url.format({
        host,
        protocol,
        pathname,
        search: qs.stringify(Object.assign({}, beforeParams, params)),
      });
    }

    const {
      preload,
      descriptors: {
        userAgent,
        viewport: { width },
      },
    } = options;

    const webviewItem = {
      attr: {
        style: {
          width: width + 'px',
          height: '100%',
        },
        preload,
        disablewebsecurity: 'true',
        useragent: userAgent,
        src,
      },
      title: '',
      devtools: false,
      uid: uuid.v4(),
      dom: null,
      ready: false,
      spinner: false,
      regiestEvent: false,
      emitter: new EventEmitter(),
    };

    return webviewItem;
  }

  @computed get offsetTop() {
    return this.navBarVisible && this.webviewCount > 0 ? 60 : 20;
  }

  @computed get webviewCount() {
    return this.webviewList.length;
  }

  @computed get maxIndex() {
    return this.webviewList.length - 1;
  }

  @computed get focusOnFisrt() {
    return this.focusIndex === 0 && this.webviewList.length > 0;
  }

  @computed get focusOnLast() {
    return (
      this.focusIndex === this.webviewList.length - 1 &&
      this.webviewList.length > 0
    );
  }

  @computed get focusWebview() {
    if (this.webviewCount > 0) {
      return this.webviewList[this.focusIndex];
    } else {
      return null;
    }
  }

  @computed get focusDevtoolsState() {
    if (this.focusWebview) {
      return this.focusWebview.devtools;
    } else {
      return false;
    }
  }

  @computed get focusWebviewUrl() {
    if (this.focusWebview) {
      return this.focusWebview.attr.src;
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
    if (this.focusWebview) {
      return this.focusWebview.spinner;
    } else {
      return false;
    }
  }

  @action
  public globalWebviewSender(name: string, params: any) {
    this.webviewList.map((curWebview: any) => {
      if (curWebview) {
        curWebview.dom.send(name, params);
      }
    });
  }

  @action
  public focusWebviewSender(name: string, params: any) {
    if (this.focusWebview) {
      this.focusWebview.dom.send(name, params);
    }
  }

  @action
  getDirective(name: string, params: any) {
    this.directive = { name, params };
    if (
      /createNewWebview|replaceWebview|clearAllThenCreateNewWebview/.test(name)
    ) {
      const { url, options } = params;
      this[name](url, options);
    } else if (/clearToAnyWebview/.test(name)) {
      const { index, data } = params;
      this[name](index);
      if (this.focusWebview) {
        this.focusWebview.dom.send('resume-page-event', data);
      }
    } else if (/clearToSomeoneWebview/.test(name)) {
      const { url, data } = params;
      this[name](url);
      if (this.focusWebview) {
        this.focusWebview.dom.send('resume-page-event', data);
      }
    } else if (/toogleRefresh/.test(name)) {
      this[name](params);
    } else if (
      /focusToNextWebview|focusToPrevWebview|reloadFocusWebview|clearOtherWebviews|clearAllWebviews|clearCurrentWebview|clearFocusWebviewHistory/.test(
        name
      )
    ) {
      this[name]();
    } else if (/clearWebviewByPathName/.test(name)) {
      const { url, data } = params;
      this[name](url);
      if (this.focusWebview) {
        this.focusWebview.dom.send('resume-page-event', data);
      }
    } else if (/showDatePicker/.test(name)) {
      const { mode, title, minDate, maxDate, dateFormat, value, uid } = params;
      const fmt = dateFormat;
      this[name]({
        mode,
        title,
        minDate: minDate ? moment(minDate, fmt).toDate() : null,
        maxDate: maxDate ? moment(maxDate, fmt).toDate() : null,
        value: value ? moment(value, fmt).toDate() : null,
        onChange: (time: any) => {
          this.focusWebviewSender(uid, {
            currentDate: moment(time).format(fmt),
            actionType: '1',
          });
        },
        onDismiss: () => {
          this.focusWebviewSender(uid, {
            currentDate: '',
            actionType: '0',
          });
        },
      });
    } else if (/showPicker/.test(name)) {
      const { data, value, title, uid } = params;
      this[name]({
        title,
        data,
        value,
        cols: (value && value.length) || 1,
        onChange: (val: any) => {
          this.focusWebviewSender(uid, {
            result: val,
            actionType: '1',
          });
        },
        onDismiss: () => {
          this.focusWebviewSender(uid, {
            result: [],
            actionType: '0',
          });
        },
      });
    } else if (/setNavBarMask/.test(name)) {
      const { visible, color } = params;
      this[name](visible, color);
    } else if (/setMenuVisible/.test(name)) {
      const { direction, visible } = params;
      if (direction === 'left') {
        this.leftMenusVisible = visible;
      } else {
        this.rightMenusVisible = visible;
      }
    } else if (/setMenu/.test(name)) {
      const { diretion, menus } = params;
      if (diretion === 'left') {
        this.leftMenus = menus;
      } else {
        this.rightMenus = menus;
      }
    } else if (/setMiddleTitle/.test(name)) {
      const { title, color, img } = params;
      this.middleTitle = {
        title,
        color,
        img,
      };
    } else if (/setNavBarBottomLineColor/.test(name)) {
      const { color } = params;
      this.navBarBottomLineColor = color;
    } else if (/setNavBarBgColor/.test(name)) {
      const { color } = params;
      this.navBarBgColor = color;
    } else if (/setNavBarVisible/.test(name)) {
      const { visible } = params;
      this.navBarVisible = visible;
    } else if (/login/.test(name)) {
      const { pageUrl } = params;

      if (pageUrl) {
        this.afterLoginRedirectUrl = pageUrl;
      }

      this.setLogintState(true);
    } else if (/getSessionID/.test(name)) {
      const { uid } = params;
      this.focusWebviewSender(uid, {
        sessionID: this.sessionID,
      });
    } else if (/getUserInfo/.test(name)) {
      const { uid } = params;
      this.focusWebviewSender(uid, {
        userInfo: this.userInfo,
      });
    } else if (/updateUserInfo/.test(name)) {
      const { uid } = params;
      this.submitLogin(true, (data: any) => {
        this.focusWebviewSender(uid, data);
      });
    } else if (/cleanUserInfo/.test(name)) {
      this.sessionID = '';
      this.userInfo = {};
    } else if (/setSessionID/.test(name)) {
      const { sessionID } = params;
      this.sessionID = sessionID;
    } else if (/cheetahRpc/.test(name)) {
      const { uid, opts } = params;
      this.rpc(opts, (result: any) => {
        this.focusWebviewSender(uid, result);
      });
    } else if (/postNotification/.test(name)) {
      this.globalWebviewSender('notify-trigger', params);
    } else {
      interaction(
        name,
        params,
        this.focusWebviewSender,
        this.serverConnectState,
        this.wsConnectState,
        this.localMockData
      );
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
    const isLocal =
      lnk.includes('://localhost') ||
      lnk.includes('://0.0.0.0') ||
      lnk.includes('://127.0.0.1');

    // if (isBlank) {
    //   this.showLinkBar = true;
    // }

    return urlTest(lnk) || isBlank || isLocal;
  }

  @action
  public setNavBarMask(visible: boolean, color: string) {
    this.navBarMaskVisible = visible;
    this.navBarMaskBgColor = color;
  }

  @action
  public createNewWebview(lnk: string, params?: any, force?: boolean) {
    const src = this.formatUrl(lnk);
    if (!this.testUrl(src) && !force) {
      return;
    }
    this.behavior = 'create';
    const lastState = this.closeFocusDevtools();
    if (this.focusIndex !== this.maxIndex) {
      this.webviewList.splice(
        this.focusIndex + 1,
        this.maxIndex - this.focusIndex
      );
    }
    this.webviewList.push(this.webviewCreater(src, params));
    this.focusIndex = this.maxIndex;
    this.inheritDebugWebview(lastState);
  }

  @action
  public replaceWebview(lnk: string, params?: any) {
    this.behavior = 'replace';
    const src = this.formatUrl(lnk);
    if (!this.testUrl(src)) {
      return;
    }
    const lastState = this.closeFocusDevtools();
    this.webviewList[this.focusIndex] = this.webviewCreater(src, params);
    this.setTitle();
    this.inheritDebugWebview(lastState);
  }

  @action
  public clearAllWebviews() {
    this.behavior = 'clear';
    this.webviewList = [];
    this.focusIndex = 0;
  }

  @action
  public clearCurrentWebview() {
    this.behavior = 'clear';
    const lastState = this.closeFocusDevtools();
    if (this.focusIndex === 0) {
      this.webviewList = [];
      this.focusIndex = 0;
    } else {
      this.webviewList = this.webviewList.slice(0, this.focusIndex);
      this.focusIndex--;
    }
    this.setTitle();
    this.inheritDebugWebview(lastState);
    if (this.focusWebview) {
      this.focusWebview.dom.send('resume-page-event', {});
    }
  }

  @action
  public clearAllThenCreateNewWebview(lnk: string, params?: any) {
    const src = this.formatUrl(lnk);
    if (!this.testUrl(src)) {
      return;
    }
    const lastState = this.closeFocusDevtools();
    this.clearAllWebviews();
    this.createNewWebview(src, params, true);
    this.setTitle();
    this.inheritDebugWebview(lastState);
  }

  @action
  public clearFocusWebviewHistory() {
    if (this.focusWebview) {
      this.focusWebview['dom'].clearHistory();
    }
  }

  @action
  public clearOtherWebviews() {
    this.behavior = 'clear';
    if (this.focusWebview) {
      const lastState = this.closeFocusDevtools();
      this.webviewList = [this.focusWebview];
      this.focusIndex = 0;
      this.setTitle();
      this.inheritDebugWebview(lastState);
    }
  }

  private removeSlash(path: string | undefined) {
    if (path) {
      return path.slice(-1) === '/' ? path.slice(0, -1) : path;
    } else {
      return '';
    }
  }

  @action
  public clearWebviewByPathName(lnks: string[] | string) {
    this.behavior = 'clear';
    const lastState = this.closeFocusDevtools();
    const urls: string[] = Array.isArray(lnks) ? lnks : [lnks];
    this.webviewList = this.webviewList.filter((view: any) => {
      const originSrc = view.attr.src;
      const curPathName = url.parse(originSrc).pathname || originSrc;
      const hasOne = urls.some(
        (lnk: string) => this.removeSlash(lnk) === this.removeSlash(curPathName)
      );
      return !hasOne;
    });
    this.focusIndex = this.maxIndex;
    this.setTitle();
    this.inheritDebugWebview(lastState);
  }

  @action
  public clearToSomeoneWebview(lnk: string) {
    this.behavior = 'clear';
    let targetIndex = null;
    const lastState = this.closeFocusDevtools();
    const isExistLnk = this.webviewList.some((view: any, index: number) => {
      const originSrc = view.attr.src;
      const curPathName = url.parse(originSrc).pathname || originSrc;
      const hasOne = this.removeSlash(lnk) === this.removeSlash(curPathName);
      targetIndex = index;
      return hasOne;
    });
    if (isExistLnk && targetIndex !== null) {
      this.webviewList = this.webviewList.slice(0, targetIndex + 1);
      this.focusIndex = this.maxIndex;
      this.setTitle();
      this.inheritDebugWebview(lastState);
    }
  }

  @action
  public getIndexWebviewDOM(el: any) {
    if (!el) {
      return;
    }
    el.addEventListener('ipc-message', ({ channel, args }: any) => {
      if (this.webviewCount === 0) {
        this.getDirective(channel, args[0]);
      }
    });
  }

  @action
  public getWebviewDOM(index: number, el: any) {
    if (!el) {
      return;
    }
    const current = this.webviewList[index];
    if (current.regiestEvent) {
      return;
    }

    current['dom'] = el;

    el.addEventListener('did-start-loading', () => {
      current['spinner'] = true;
    });

    el.addEventListener('new-window', (ev: any) => {
      if (this.focusWebview) {
        this.focusWebview.attr.src = ev.url;
      }
    });

    el.addEventListener('did-stop-loading', () => {
      current['spinner'] = false;
    });

    // el.getWebContents().debugger.sendCommand(
    //   'Emulation.setTouchEmulationEnabled',
    //   {
    //     enabled: true,
    //     configuration: 'mobile',
    //   }
    // );

    el.addEventListener('dom-ready', () => {
      current['emitter'].emit('ready');
      el.insertCSS(scrollbarStyleString);
      // el.setZoomLevel(0.8);

      const tit = el.getTitle();
      current['title'] = tit;
      this.setTitle();

      el.addEventListener('devtools-closed', () => {
        current['devtools'] = false;
      });

      current['ready'] = true;
    });

    el.addEventListener('ipc-message', ({ channel, args }: any) => {
      this.getDirective(channel, args[0]);
    });

    current.regiestEvent = true;
  }

  @action
  public focusToNextWebview() {
    this.behavior = 'navigate';
    if (this.focusIndex < this.maxIndex) {
      const lastState = this.closeFocusDevtools();
      this.focusIndex++;
      this.inheritDebugWebview(lastState);
      this.setTitle();
      if (this.focusWebview) {
        this.focusWebview.dom.send('resume-page-event', {});
      }
    }
  }

  @action
  public goToAnyWebview(count: number) {
    if (isNaN(count)) {
      return;
    }
    this.behavior = 'navigate';
    if (count < 0) {
      const num = Math.abs(count);
      if (this.focusIndex - num >= 0) {
        const lastState = this.closeFocusDevtools();
        this.focusIndex = this.focusIndex - num;
        this.inheritDebugWebview(lastState);
      }
    } else if (this.focusIndex + count <= this.maxIndex) {
      const lastState = this.closeFocusDevtools();
      this.focusIndex = this.focusIndex + count;
      this.inheritDebugWebview(lastState);
    }
    this.setTitle();
  }

  @action
  public clearToAnyWebview(count: number) {
    if (isNaN(count) || count > 0) {
      return;
    }
    this.behavior = 'clear';
    const num = Math.abs(count);
    const backSize = this.focusIndex - num;
    if (backSize >= 0) {
      const lastState = this.closeFocusDevtools();
      this.webviewList = this.webviewList.slice(0, backSize + 1);
      this.focusIndex = this.maxIndex;
      this.inheritDebugWebview(lastState);
    }
    this.setTitle();
  }

  @action
  public focusToPrevWebview() {
    this.behavior = 'navigate';
    if (this.focusIndex > 0) {
      const lastState = this.closeFocusDevtools();
      this.focusIndex--;
      this.inheritDebugWebview(lastState);
      this.setTitle();
      if (this.focusWebview) {
        this.focusWebview.dom.send('resume-page-event', {});
      }
    }
  }

  @action
  public closeFocusDevtools() {
    const current = this.focusWebview;
    if (current && current.ready) {
      const lastState = current.devtools;
      const dom = current.dom;
      dom.closeDevTools();
      current.devtools = false;
      return lastState;
    }
    return false;
  }

  @action
  public debugFocusWebview() {
    const current = this.focusWebview;
    if (current && current.ready) {
      const dom = current.dom;
      current.devtools ? dom.closeDevTools() : dom.openDevTools();
      current.devtools = !current.devtools;
    }
  }

  @action
  public inheritDebugWebview(prevState: boolean) {
    const current = this.focusWebview;

    const run = () => {
      const dom = current.dom;
      prevState ? dom.openDevTools() : dom.closeDevTools();
      current.devtools = prevState;
    };

    current['ready'] ? run() : current['emitter'].once('ready', run);
  }

  @action
  public reloadFocusWebview() {
    const current = this.focusWebview;
    if (current && current.ready) {
      const dom = current.dom;
      dom.reloadIgnoringCache();
    }
  }

  @action
  public initDatePicker(el: any) {
    this.datepickerElement = el;
  }

  @action
  public showDatePicker(opts: any) {
    this.datepickerParams = opts;
    if (this.datepickerElement) {
      this.datepickerElement.click();
    }
  }

  @action
  public initPicker(el: any) {
    this.pickerElement = el;
  }

  @action
  public showPicker(opts: any) {
    this.pickerParams = opts;
    if (this.pickerElement) {
      this.pickerElement.click();
    }
  }
}
