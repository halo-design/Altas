import { inject, observer } from 'mobx-react';
import * as React from 'react';
import allDevices from '../../config/DeviceDescriptors';
import Select from 'antd/lib/select';
import { cleanAppCache, cleanAppData } from '../../bridge/file';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';

const { confirm } = Modal;
const { Option } = Select;

import './index.scss';

@inject((stores: any) => {
  return {
    appInfo: stores.workStation.appInfo,
    altasAppAudioStatus: stores.workStation.altasAppAudioStatus,
    useDebugDevice: stores.terminal.useDebugDevice,
    useDebugSimulator: stores.terminal.useDebugSimulator,
    setUseDebugDevice: (type: string) =>
      stores.terminal.setUseDebugDevice(type),
    setUseDebugSimulator: (type: string) =>
      stores.terminal.setUseDebugSimulator(type),
    setAppAudioStatus: (status: string) =>
      stores.workStation.setAppAudioStatus(status),
    setMonitorVisible: (state: boolean) =>
      stores.workStation.setMonitorVisible(state),
  };
})
@observer
class SettingsView extends React.Component<any> {
  public deviceOnChange(val: string) {
    this.props.setUseDebugDevice(val);
  }

  public simulatorOnChange(val: string) {
    this.props.setUseDebugSimulator(val);
  }

  public componentDidMount() {
    this.props.setMonitorVisible(false);
  }

  public componentWillUnmount() {
    this.props.setMonitorVisible(true);
  }

  public cleanAppCache() {
    confirm({
      title: '清除应用',
      content: '是否清除全部应用缓存？',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        cleanAppCache();
        cleanAppData((args: any) => {
          console.log(args);
          message.info('缓存清理完成！');
        });
      },
      onCancel: () => {},
    });
  }

  public render() {
    return (
      <div className="page-settings">
        <h1 className="title">基本设置</h1>
        <div className="form-table">
          <div className="form-item project-type-selection">
            <div className="label">调试设备</div>
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
          <div className="form-item project-type-selection">
            <div className="label">默认调试模拟器</div>
            <div className="item">
              <Select
                style={{ width: 280 }}
                defaultValue={this.props.useDebugSimulator}
                size="default"
                onChange={(val: string) => this.simulatorOnChange(val)}
              >
                <Option value="deviceSimulator">Web应用调试器</Option>
                <Option value="cheetahSimulator">猎豹App调试器</Option>
              </Select>
            </div>
          </div>
          <div className="form-item project-type-selection">
            <div className="label">开启/关闭提示音</div>
            <div className="item">
              <Select
                style={{ width: 280 }}
                defaultValue={this.props.altasAppAudioStatus}
                size="default"
                onChange={(val: string) => this.props.setAppAudioStatus(val)}
              >
                <Option value="on">开启</Option>
                <Option value="off">关闭</Option>
              </Select>
            </div>
          </div>
          <div className="form-item project-type-selection">
            <div className="label">当前应用版本</div>
            <div className="item">Version {this.props.appInfo.version}</div>
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
