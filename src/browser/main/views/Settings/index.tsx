import { inject, observer } from 'mobx-react';
import * as React from 'react';
import allDevices from '../../config/DeviceDescriptors';
import Select from 'antd/lib/select';
import { cleanAppCache, cleanAppData } from '../../bridge/modules/file';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';

const { TextArea } = Input;

const { confirm } = Modal;
const { Option } = Select;

import './index.scss';

@inject((stores: any) => {
  return {
    appInfo: stores.workBench.appInfo,
    altasAppAudioStatus: stores.workBench.altasAppAudioStatus,
    useDebugDevice: stores.terminal.useDebugDevice,
    deviceConfig: stores.terminal.deviceConfig,
    customUAState: stores.terminal.customUAState,
    customUAString: stores.terminal.customUAString,
    useDebugSimulator: stores.terminal.useDebugSimulator,
    setCunstomUAState: (state: boolean) =>
      stores.terminal.setCunstomUAState(state),
    setCunstomUAString: (type: string) =>
      stores.terminal.setCunstomUAString(type),
    setUseDebugDevice: (type: string) =>
      stores.terminal.setUseDebugDevice(type),
    setUseDebugSimulator: (type: string) =>
      stores.terminal.setUseDebugSimulator(type),
    setAppAudioStatus: (status: string) =>
      stores.workBench.setAppAudioStatus(status),
    setMonitorVisible: (state: boolean) =>
      stores.workBench.setMonitorVisible(state),
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
      onCancel: () => void 0,
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
                style={{ width: 320 }}
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
                style={{ width: 320 }}
                defaultValue={this.props.useDebugSimulator}
                size="default"
                onChange={(val: string) => this.simulatorOnChange(val)}
              >
                <Option value="deviceSimulator">Web应用调试器</Option>
                <Option value="cheetahSimulator">猎豹App调试器</Option>
              </Select>
            </div>
          </div>
          <div className="form-item">
            <div className="label">开启自定义UA</div>
            <div className="item">
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                onChange={(e: boolean) => {
                  this.props.setCunstomUAState(e);
                }}
                defaultChecked={this.props.customUAState}
              />
            </div>
          </div>
          <div className="form-item">
            <div className="label">自定义UA参数</div>
            <div className="item">
              <TextArea
                defaultValue={
                  this.props.customUAString || this.props.deviceConfig.userAgent
                }
                style={{ width: 320 }}
                onBlur={(e: any) => {
                  this.props.setCunstomUAString(e.target.value);
                }}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </div>
          </div>
          <div className="form-item project-type-selection">
            <div className="label">开启/关闭提示音</div>
            <div className="item">
              <Select
                style={{ width: 320 }}
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
