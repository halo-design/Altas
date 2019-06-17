import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { openDeviceDebug, closeWindow } from '../../bridge/createWindow';
import allDevices, { allDeviceObject } from '../../config/DeviceDescriptors';
import Select from 'antd/lib/select';

const { Option } = Select;

import './index.scss';

@inject((stores: any) => {
  return {
    useDebugDevice: stores.terminal.useDebugDevice,
    shell: (s: string) => stores.terminal.shell(s),
    clear: () => stores.terminal.clear(),
    kill: () => stores.terminal.kill(),
    scrollToBottom: () => stores.terminal.scrollToBottom(),
    setUseDebugDevice: (type: string) =>
      stores.terminal.setUseDebugDevice(type),
  };
})
@observer
class HomeView extends React.Component<any> {
  public win_uid: string = '';

  public createWin() {
    openDeviceDebug(
      {
        target: 'https://www.baidu.com',
        preload: './devTools/dev-tools.js',
        descriptors: allDeviceObject[this.props.useDebugDevice],
      },
      (params: any) => {
        this.win_uid = params.win_uid;
      }
    );
  }

  public closeWin() {
    if (this.win_uid) {
      closeWindow(this.win_uid);
    }
  }

  public deviceOnChange(val: string) {
    this.props.setUseDebugDevice(val);
  }

  public render() {
    return (
      <div className="page-home">
        <br />
        <br />
        <br />
        <div className="form-table">
          <div className="form-item project-type-selection">
            <div className="label">选择调试设备</div>
            <Select
              style={{ width: 360 }}
              defaultValue={this.props.useDebugDevice}
              size="large"
              onChange={(val: string) => this.deviceOnChange(val)}
            >
              {allDevices.map(({ name }: any) => (
                <Option value={name} key={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <button
          onClick={e => {
            this.createWin();
          }}
        >
          打开新窗口
        </button>
        <button
          onClick={e => {
            this.closeWin();
          }}
        >
          关闭新窗口
        </button>
        <button
          onClick={e => {
            this.props.clear();
          }}
        >
          清除控制台
        </button>
        <button
          onClick={e => {
            this.props.shell('ls');
          }}
        >
          执行命令
        </button>
        <button
          onClick={e => {
            this.props.kill();
          }}
        >
          关闭
        </button>
      </div>
    );
  }
}

export default HomeView;
