import { action, observable, computed } from 'mobx';
import message from 'antd/lib/message';
import { Howl } from 'howler';
import { detectSupportEnv } from '../bridge/env';
import * as storage from '../bridge/storage';
import { getProjectRunnerConfig } from '../bridge/project';
import initEnvData from '../config/envScan';
import { appVersion } from '../constants/API';

export default class WorkStationModel {
  @observable public monitorVisible: boolean = true;
  @observable public stateBarText: string = '等待操作';
  @observable public isOnline: boolean = false;
  @observable public isFreeze: boolean = false;
  @observable public showStats: boolean = true;
  @observable public stateBarStatus: number = 0; // -1: running 1: sucess; 0: normal; 2: warn; 3: error;
  @observable public systemEnv: object[] = initEnvData;
  @observable public appInfo: object = {
    version: appVersion,
  };
  @observable public userDefaultProjectPath: string = '';
  @observable public projectRunnerConfig: any = {
    configList: {
      command: [],
    },
    noProject: true,
    noConfig: true,
  };

  public altasAppAudioStatus: string = 'on';
  public altasAppSound: any = new Howl({
    src: ['public/ding.mp3'],
    volume: 0.2,
  });

  constructor() {
    this.detectNetwork();
    this.getLocalUserProjectPath();
    this.getLocalSystemEnvData();
    this.playAltasAppSound();
  }

  @action
  public setStatsVisible(state: boolean) {
    this.showStats = state;
  }

  @action
  public setAppAudioStatus(status: string) {
    this.altasAppAudioStatus = status;
    storage.write('altas_app_sound', {
      altas_app_sound: status,
    });
  }

  @action
  public async playAltasAppSound() {
    const localData: any = await storage.readSync('altas_app_sound');
    const { altas_app_sound } = localData;
    if (altas_app_sound) {
      this.altasAppAudioStatus = altas_app_sound;
    }
    if (this.altasAppAudioStatus === 'on') {
      this.altasAppSound.play();
    }
  }

  @action
  public async getLocalUserProjectPath() {
    const localData: any = await storage.readSync('user_default_project_path');
    const { user_default_project_path } = localData;
    if (user_default_project_path) {
      this.userDefaultProjectPath = user_default_project_path;
      getProjectRunnerConfig(user_default_project_path, (data: object) => {
        this.projectRunnerConfig = data;
      });
    }
  }

  @action
  public async getLocalSystemEnvData() {
    const localData: any = await storage.readSync('system_support_environment');
    const { system_support_environment } = localData;
    if (system_support_environment) {
      this.systemEnv = system_support_environment;
    }
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
  public setStateBarCode(statusCode: number) {
    this.stateBarStatus = statusCode;
  }

  @action
  public setStateBar(str: string, statusCode?: number) {
    if (statusCode) {
      this.stateBarStatus = statusCode;
    }
    this.stateBarText = str;
  }

  @action
  public setFreeze(status: boolean) {
    this.isFreeze = status;
  }

  @action
  public resetStateBar() {
    this.stateBarText = '等待操作';
    this.stateBarStatus = 0;
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
