import { inject, observer } from 'mobx-react';
import * as React from 'react';
import allDevices from '../../config/DeviceDescriptors';
import Select from 'antd/lib/select';
import { cleanAppCache } from '../../bridge/file';
import message from 'antd/lib/message';

const { Option } = Select;

import './index.scss';

@inject((stores: any) => {
  return {
    useDebugDevice: stores.terminal.useDebugDevice,
    setUseDebugDevice: (type: string) =>
      stores.terminal.setUseDebugDevice(type),
    setMonitorVisible: (state: boolean) =>
      stores.workStation.setMonitorVisible(state),
  };
})
@observer
class SettingsView extends React.Component<any> {
  public deviceOnChange(val: string) {
    this.props.setUseDebugDevice(val);
  }

  public componentDidMount() {
    this.props.setMonitorVisible(false);
  }

  public componentWillUnmount() {
    this.props.setMonitorVisible(true);
  }

  public cleanAppCache() {
    cleanAppCache((args: any) => {
      console.log(args);
      message.info('缓存清理完成！');
    });
  }

  public render() {
    return (
      <div className="page-settings">
        <h1 className="title">基本设置</h1>
        <div className="form-table">
          <div className="form-item project-type-selection">
            <div className="label">选择调试设备</div>
            <div className="item">
              <Select
                style={{ width: 280 }}
                defaultValue={this.props.useDebugDevice}
                size="default"
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
          <div className="form-item">
            <div className="label">清理缓存</div>
            <div className="item">
              <div
                className="btn-default"
                onClick={() => {
                  this.cleanAppCache();
                }}
              >
                一键清理缓应用缓存
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsView;
