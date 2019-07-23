import { action, observable, computed } from 'mobx';
import { getIpAddress } from '../bridge/system';

export default class CreateServerModel {
  public protocol: string = 'http';
  @observable public projectDirectory: string = '';
  @observable public createServerDrawerVisible: boolean = false;
  @observable public createServerMonitorVisible: boolean = false;
  @observable public createServerMonitorStatus: string = 'on';
  @observable public localHostNameList: string[] = ['localhost'];
  @observable public localHostName: string = 'localhost';
  @observable public localHostPort: string = '8080';
  @observable public debugTool: string = 'none';
  @observable public proxyTables: object[] = [];

  @computed get webServerHost() {
    return `${this.protocol}://${this.localHostName}:${this.localHostPort}`;
  }

  constructor() {
    getIpAddress((addr: any) => {
      this.localHostNameList.push(addr.ip);
    });
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
    this.localHostPort = port;
  }

  @action
  public setCreateServerMonitorStatus(status: string) {
    this.createServerMonitorStatus = status;
  }

  @action
  public setCreateServerMonitorVisible(state: boolean) {
    this.createServerMonitorVisible = state;
  }

  @action
  public setCreateServerDrawerVisible(state: boolean) {
    this.createServerDrawerVisible = state;
  }
}
