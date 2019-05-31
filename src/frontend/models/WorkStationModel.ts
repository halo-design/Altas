import { action, observable } from 'mobx';
import { detectSupportEnv, getAppInfo } from '../utils/env';

export default class WorkStationModel {
  @observable public monitorVisible: boolean = true;
  @observable public stateBarText: string = '等待操作';
  @observable public isFreeze: boolean = false;
  @observable public stateBarStatus: number = 1; // 0: sucess; 1: normal; 2: warn; 3: error;
  @observable public systemEnv: object = {};
  @observable public appInfo: object = {
    version: '0.0.0',
  };

  constructor() {
    setTimeout(() => {
      getAppInfo((param: any) => {
        this.appInfo = param;
      });
    }, 2000);
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
      this.systemEnv = param;
      if (cb) {
        cb(param);
      }
    });
  }
}
