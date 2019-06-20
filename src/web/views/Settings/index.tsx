import { inject, observer } from 'mobx-react';
import * as React from 'react';
import allDevices from '../../config/DeviceDescriptors';
import Select from 'antd/lib/select';

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
        </div>
      </div>
    );
  }
}

export default SettingsView;
