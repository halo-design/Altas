import { action, observable } from 'mobx';

export default class WorkStationModel {
  @observable public monitorVisible: boolean = true;
  @observable public stateBarText: string = '等待操作';
  @observable public stateBarStatus: number = 1; // 0: sucess; 1: normal; 2: warn; 3: error;

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
  public resetStateBar() {
    this.stateBarText = '等待操作';
    this.stateBarStatus = 1;
  }
}
