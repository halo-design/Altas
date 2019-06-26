import * as qs from 'qs';
import { action, observable } from 'mobx';
const options = qs.parse(location.hash.substr(1));

export default class WebviewModel {
  public systemSetting: object = options;
  @observable public webviewList: any[] = [];

  @action
  public createWebview(index?: number) {
    //
  }
}
