import { action, observable } from 'mobx';
import message from 'antd/lib/message';
import { detectSupportEnv, getAppInfo } from '../utils/env';
import * as storage from '../utils/storage';

const initEnvData = [
  {
    name: 'Node.js',
    icon_name: 'node',
    version: null,
    current_version: null,
    download_lnk: 'http://nodejs.cn/download/',
  },
  {
    name: 'NPM',
    icon_name: 'npm',
    version: null,
    current_version: null,
    download_lnk: 'http://caibaojian.com/npm/all.html',
  },
  {
    name: 'Yarn',
    icon_name: 'yarn',
    version: null,
    current_version: null,
    download_lnk: 'https://cli.vuejs.org/zh/guide/prototyping.html',
  },
  {
    name: 'Vue CLI',
    icon_name: 'vue',
    version: null,
    current_version: null,
    download_lnk: 'https://yarn.bootcss.com/docs/install/',
  },
  {
    name: 'Python',
    icon_name: 'python',
    version: null,
    current_version: null,
    download_lnk: 'https://www.python.org/getit/',
  },
];

export default class WorkStationModel {
  @observable public monitorVisible: boolean = true;
  @observable public stateBarText: string = '等待操作';
  @observable public isOnline: boolean = false;
  @observable public isFreeze: boolean = false;
  @observable public stateBarStatus: number = 1; // 0: sucess; 1: normal; 2: warn; 3: error;
  @observable public systemEnv: object[] = initEnvData;
  @observable public appInfo: object = {
    version: '0.0.0',
  };
  @observable public userDefaultProjectPath: string = '';

  constructor() {
    setTimeout(() => {
      getAppInfo((param: any) => {
        this.appInfo = param;
      });

      storage.read('user_default_project_path', (data: any) => {
        const { user_default_project_path } = data;
        if (user_default_project_path) {
          this.userDefaultProjectPath = user_default_project_path;
        }
      });
    }, 2000);
    this.detectNetwork();
  }

  @action
  public resetEnvData() {
    this.systemEnv = [];
  }

  @action
  public setUserDefaultProjerctPath(dir: string) {
    this.userDefaultProjectPath = dir;
    if (dir) {
      storage.write('user_default_project_path', {
        user_default_project_path: dir,
      });
    }
  }

  @action
  public detectNetwork() {
    this.isOnline = navigator.onLine;
    window.addEventListener('offline', () => {
      this.isOnline = false;
      message.warning('网络连接已断开！');
    });

    window.addEventListener('online', () => {
      this.isOnline = true;
      message.success('网络已连接！');
    });
  }

  @action
  public setMonitorVisible(state: boolean) {
    this.monitorVisible = state;
  }

  @action
  public setStateBar(str: string, statusCode?: number) {
    if (statusCode === void 0) {
      statusCode = 1;
    }
    this.stateBarText = str;
    this.stateBarStatus = statusCode;
  }

  @action
  public setFreeze(status: boolean) {
    this.isFreeze = status;
  }

  @action
  public resetStateBar() {
    this.stateBarText = '等待操作';
    this.stateBarStatus = 1;
  }

  public getEnvSupport(cb: Function) {
    detectSupportEnv((param: any) => {
      this.systemEnv = param.env_support;
      if (cb) {
        cb(param);
      }
    });
  }
}
