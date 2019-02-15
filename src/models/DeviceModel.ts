import { action, observable } from 'mobx';
import * as API from '../constants/API';
import { getData } from '../utils/ajax';
import { getDeviceOS, getIpAddress } from '../utils/bridge';

export default class DeviceModel {
  @observable public ipAddress: any = {};
  @observable public os: object = {};

  @action
  public getIpAddress (cb?: (data: object) => void) {
    if (this.ipAddress.cip) {
      return
    }

    getIpAddress((addr: any) => {
      this.ipAddress.local = addr.ip;
    })

    getDeviceOS((info: any) => {
      this.os = info;
    })

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
