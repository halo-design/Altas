import { action, observable } from 'mobx';
import * as API from '../constants/API';
import { getData } from '../utils/ajax';

export default class DeviceModel {
  @observable public ipAddress: object = {};

  @action
  public getIpAddress (cb?: (data: object) => void) {
    getData(API.ipAddress)
      .then((param: any) => {
        const data = JSON.parse(param.match(/\{[^\}]+\}/)[0]);
        this.ipAddress = data;
        if (cb) {
          cb(data);
        }
      })
  }
}
