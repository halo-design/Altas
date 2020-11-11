import { action, observable } from 'mobx';
import * as API from '../constants/API';
import { getData } from '../utils/ajax';
import { getDeviceOS, getDeviceStatus, getIpAddress } from '../bridge/system';

export default class DeviceModel {
  @observable public ipAddress: any = {};
  @observable public os: any = {
    cpu: {
      brand: '未知型号',
      speed: 0,
      physicalCores: 0,
    },
    graphics: {
      controllers: [
        {
          model: '未知型号',
        },
      ],
    },
  };
  @observable public hardwareStatus = {
    mem: {
      used: 0,
      total: 0,
    },
  };

  constructor() {
    this.getDeviceInfo();
  }

  @action
  public getDeviceInfo() {
    getDeviceOS((info: any) => {
      this.os = info;
    });
  }

  @action
  public getDeviceStatus() {
    getDeviceStatus((status: any) => {
      this.hardwareStatus = status;
    });
  }

  @action
  public getIpAddress(cb?: (data: any) => void) {
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
