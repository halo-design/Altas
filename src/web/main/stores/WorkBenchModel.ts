import { action, observable, computed } from 'mobx';
import message from 'antd/lib/message';
import { Howl } from 'howler';
import { detectSupportEnv } from '../bridge/modules/env';
import { getProjectRunnerConfig } from '../bridge/modules/project';
import { dataReadSync, dataWrite, dataRemove } from '../utils/dataManage';
import initEnvData from '../config/envScan';
import { appVersion } from '../constants/API';

const merge = require('lodash/merge');
const defaultProjectConfig = {
  configList: {
    type: 'web',
    modules: '',
    port: 8080,
    dist: 'dist',
    command: [],
    scripts: {
      dev: 'dev',
      build: 'build',
    },
  },
  noProject: true,
  noConfig: true,
};

export default class WorkBenchModel {
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
  @observable public projectRunnerConfig: any = defaultProjectConfig;
  public altasAppAudioStatus: string = 'on';
  public altasAppSound: any = new Howl({
    src: ['public/audio/ding.mp3'],
    volume: 0.2,
  });
  public noticeSound: any = new Howl({
    src: ['public/audio/dong.mp3'],
    volume: 0.3,
  });

  constructor() {
    this.detectNetwork();
    this.getLocalUserProjectPath();
    this.getLocalSystemEnvData();
    this.getLocalSoundConfig();
    this.playAltasAppSound();
  }

  @action
  public async getLocalSoundConfig() {
    const localData: any = await dataReadSync('altas_app_sound');
    if (localData) {
      this.altasAppAudioStatus = localData;
    }
  }

  @action
  public setStatsVisible(state: boolean) {
    this.showStats = state;
  }

  @action
  public setAppAudioStatus(status: string) {
    this.altasAppAudioStatus = status;
    dataWrite('altas_app_sound', status);
  }

  @action
  public playAltasAppSound() {
    if (this.altasAppAudioStatus === 'on') {
      this.altasAppSound.play();
    }
  }

  @action
  public playAltasNoticeSound() {
    if (this.altasAppAudioStatus === 'on') {
      this.noticeSound.play();
    }
  }

  @action
  public async getLocalUserProjectPath() {
    const localData: any = await dataReadSync('user_default_project_path');
    if (localData) {
      this.userDefaultProjectPath = localData;
      this.refreshPorjectConfig();
    }
  }

  @action
  public async getLocalSystemEnvData() {
    const localData: any = await dataReadSync('system_support_environment');
    if (localData) {
      this.systemEnv = localData;
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
    dataRemove('system_support_environment');
  }

  @action
  public setUserDefaultProjerctPath(dir: string) {
    this.userDefaultProjectPath = dir;
    if (dir) {
      dataWrite('user_default_project_path', dir);
      this.refreshPorjectConfig();
    }
  }

  @action
  public refreshPorjectConfig(cb?: Function) {
    getProjectRunnerConfig(this.userDefaultProjectPath, (data: object) => {
      this.projectRunnerConfig = merge({}, defaultProjectConfig, data);
      cb && cb(data);
    });
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
      dataWrite('system_support_environment', param.env_support);
      if (cb) {
        cb(param);
      }
    });
  }
}
