import { action, observable, computed } from 'mobx';
import message from 'antd/lib/message';
import { detectSupportEnv, getAppInfo } from '../utils/env';
import * as storage from '../utils/storage';
import { getProjectRunnerConfig } from '../utils/project';

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
  @observable public projectRunnerConfig: any = {
    configList: {
      command: [],
    },
    noProject: true,
    noConfig: true,
  };

  constructor() {
    getAppInfo((param: any) => {
      this.appInfo = param;
    });
    this.detectNetwork();
    this.getLocalUserProjectPath();
    this.getLocalSystemEnvData();
  }

  @action
  getLocalUserProjectPath() {
    storage.read('user_default_project_path', (data: any) => {
      const { user_default_project_path } = data;
      if (user_default_project_path) {
        this.userDefaultProjectPath = user_default_project_path;
        getProjectRunnerConfig(user_default_project_path, (data: object) => {
          this.projectRunnerConfig = data;
        });
      }
    });
  }

  @action
  getLocalSystemEnvData() {
    storage.read('system_support_environment', (data: any) => {
      const { system_support_environment } = data;
      if (system_support_environment) {
        this.systemEnv = system_support_environment;
      }
    });
  }

  @computed get systemEnvObject() {
    const obj = {};
    this.systemEnv.forEach((item: any) => {
      obj[item.name] = item;
    });

    return obj;
  }

  @action
  public resetEnvData() {
    this.systemEnv = [];
    storage.remove('system_support_environment');
  }

  @action
  public setUserDefaultProjerctPath(dir: string) {
    this.userDefaultProjectPath = dir;
    if (dir) {
      storage.write('user_default_project_path', {
        user_default_project_path: dir,
      });
      getProjectRunnerConfig(dir, (data: object) => {
        this.projectRunnerConfig = data;
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

  @action
  public getEnvSupport(cb: Function) {
    detectSupportEnv((param: any) => {
      this.systemEnv = param.env_support;
      storage.write('system_support_environment', {
        system_support_environment: param.env_support,
      });
      if (cb) {
        cb(param);
      }
    });
  }
}
