import { action, observable } from 'mobx';
import * as API from '../constants/API';
import { getData } from '../utils/ajax';
import { getIpAddress } from '../utils/bridge';

export default class DeviceModel {
  @observable public ipAddress: any = {};

  constructor () {
    getIpAddress(addr => {
      this.ipAddress.local = addr
    })
  }

  @action
  public getIpAddress (cb?: (data: object) => void) {
    getData(API.ipAddress)
      .then((param: any) => {
        const data = JSON.parse(param.match(/\{[^\}]+\}/)[0]);
        Object.assign(this.ipAddress, data);
        if (cb) {
          cb(data);
        }
      })
  }
}
