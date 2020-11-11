import { action, observable, computed } from 'mobx';
import { getIpAddress } from '../bridge/system';
import { dataRead, dataReadSync, dataWrite } from '../utils/dataManage';
import message from 'antd/lib/message';
import * as url from 'url';
import * as clipBoard from '../bridge/modules/clipBoard';
import { remote } from 'electron';
import {
  deviceSimulator,
  cheetahSimulator,
} from '../bridge/modules/createWindow';
import { allDeviceObject } from '../config/DeviceDescriptors';
import { scrollbarStyleString } from '../constants/API';
import {
  createServer,
  // serverMonitor,
  disposeServer,
} from '../bridge/modules/createServer';

const paramsTransformer = (params: any) => {
  const {
    defaultOpenFile,
    projectDirectory,
    proxyTables,
    localHostPort,
  } = params;
  const proxy = {};
  proxyTables.forEach((item: any) => {
    proxy[item.filter] = {
      target: item.host,
      changeOrigin: true,
    };
  });

  return {
    port: localHostPort,
    file: defaultOpenFile,
    root: projectDirectory,
    open: false,
    proxy,
  };
};

export default class CreateServerModel {
  public protocol: string = 'http';
  @observable public projectDirectory: string = '';
  @observable public defaultOpenFile: string = 'index.html';
  @observable public createServerDrawerVisible: boolean = false;
  @observable public localServerRunStatus: string = 'off';
  @observable public createServerMonitorStatus: string = 'on';
  @observable public localHostNameList: string[] = ['localhost'];
  @observable public localHostName: string = 'localhost';
  @observable public localHostPort: string = '8080';
  @observable public debugTool: string = 'none';
  @observable public proxyTables: any[] = [];
  @observable public useDebugDevice: string = 'iPhone 8';
  @observable public customUAState: boolean = false;
  @observable public customUAString: string = '';

  @computed get webServerHost() {
    return `${this.protocol}://${this.localHostName}:${this.localHostPort}`;
  }

  @computed get deviceConfig() {
    let config = allDeviceObject[this.useDebugDevice];
    if (this.customUAState && this.customUAString.length > 0) {
      config = {
        ...config,
        userAgent: this.customUAString,
      };
    }
    return config;
  }

  constructor() {
    getIpAddress((addr: any) => {
      this.localHostNameList.push(addr.ip);
    });
    this.initData();
  }

  @action
  private async initData() {
    dataRead('create_server_settings', (data: any) => {
      for (const key in data) {
        if (key === 'proxyTables') {
          const originArr = data[key];
          this[key] = Object.keys(originArr).map(
            (key: string) => originArr[key]
          );
        } else {
          this[key] = data[key];
        }
      }
    });

    const devToolsDebugDevice: any = await dataReadSync(
      'devtools_debug_device'
    );

    if (devToolsDebugDevice) {
      this.useDebugDevice = devToolsDebugDevice;
    }

    const customUAState: any = await dataReadSync('custom_useragent_state');

    if (customUAState) {
      this.customUAState = customUAState;
    }

    const customUAString: any = await dataReadSync('custom_useragent_string');

    if (customUAString) {
      this.customUAString = customUAString;
    }
  }

  @action
  public setDefaultOpenFile(str: string) {
    this.defaultOpenFile = str;
  }

  @action
  public pushNewItemToProxyTables(filter: string, host: string) {
    this.proxyTables.push({ filter, host });
  }

  @action
  public deleteItemFromProxyTables(index: number) {
    this.proxyTables = this.proxyTables.filter(
      (item: any, order: number) => order !== index
    );
  }

  @action
  public setProjectDirectory(dir: string) {
    this.projectDirectory = dir;
  }

  @action
  public setLocalHostName(name: string) {
    this.localHostName = name;
  }

  @action
  public setDebugTool(type: string) {
    this.debugTool = type;
  }

  @action
  public setLocalHostPort(port: string) {
    if (port && port.length === 4 && !isNaN(Number(port))) {
      this.localHostPort = port;
    } else {
      message.error('请输入正确的端口号！');
      this.localHostPort = '8080';
    }
  }

  @action
  public setCreateServerMonitorStatus(status: string) {
    this.createServerMonitorStatus = status;
  }

  @action
  public setLocalServerStatus(status: string) {
    this.localServerRunStatus = status;
  }

  @action
  public setCreateServerDrawerVisible(state: boolean) {
    this.createServerDrawerVisible = state;
  }

  @action
  public serverCreater(noSave?: boolean) {
    const {
      defaultOpenFile,
      projectDirectory,
      debugTool,
      proxyTables,
      localHostPort,
      createServerMonitorStatus,
    } = this;
    const originParams = {
      defaultOpenFile,
      projectDirectory,
      debugTool,
      proxyTables,
      localHostPort,
      createServerMonitorStatus,
    };

    !noSave && dataWrite('create_server_settings', originParams);

    this.setLocalServerStatus('running');
    const timer: any = setTimeout(() => {
      this.setLocalServerStatus('off');
      message.error('服务启动超时，请检查端口是否被占用！');
      disposeServer();
      clearTimeout(timer);
    }, 30000);

    createServer(
      paramsTransformer(originParams),
      ({ serveURLs }: any) => {
        this.setLocalServerStatus('on');
        message.info('服务已开启!');
        const serveUrl = serveURLs[0];
        const port = url.parse(serveUrl).port;
        if (port) {
          this.localHostPort = port;
        }
        if (this.debugTool === 'local') {
          remote.shell.openExternal(this.webServerHost);
        } else if (this.debugTool === 'web') {
          deviceSimulator({
            target: this.webServerHost,
            descriptors: this.deviceConfig,
            insertCSS: scrollbarStyleString,
          });
        } else if (this.debugTool === 'cheetah') {
          cheetahSimulator({
            target: this.webServerHost,
            descriptors: this.deviceConfig,
          });
        }
        clearTimeout(timer);
      },
      (err: any) => {
        this.setLocalServerStatus('off');
        message.error('服务启动失败！');
        console.log(err);
        clearTimeout(timer);
      }
    );
  }

  public copyAddress() {
    clipBoard.writeText(this.webServerHost);
    message.success('本地服务地址已复制到剪切板！');
  }

  @action
  public disposeServer() {
    disposeServer(() => {
      this.setLocalServerStatus('off');
      message.info('服务已关闭！');
    });
  }

  @action
  public restartServer() {
    disposeServer(() => {
      this.setLocalServerStatus('off');
      this.serverCreater(true);
    });
  }
}
