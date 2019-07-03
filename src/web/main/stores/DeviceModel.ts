import { action, observable } from 'mobx';
import * as API from '../constants/API';
import { getData } from '../utils/ajax';
import { getDeviceOS, getIpAddress } from '../bridge/system';

export default class DeviceModel {
  @observable public ipAddress: any = {};
  @observable public os: object = {
    hardware: {
      cpu: {
        brand: '未知处理器',
        speed: 0,
        physicalCores: 0,
      },
      mem: {
        used: 0,
        total: 0,
      },
    },
  };

  @action
  public getDeviceInfo() {
    getDeviceOS((info: any) => {
      this.os = info;
    });
  }

  @action
  public getIpAddress(cb?: (data: object) => void) {
    if (this.ipAddress.cip) {
      return;
    }

    getIpAddress((addr: any) => {
      this.ipAddress.local = addr.ip;
    });

    getData(API.ipAddress).then((param: any) => {
      const data = JSON.parse(param.match(/\{[^\}]+\}/)[0]);
      Object.assign(this.ipAddress, data);
      if (cb) {
        cb(data);
      }
    });
  }
}
