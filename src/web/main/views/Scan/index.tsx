import { remote } from 'electron';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import notification from 'antd/lib/notification';
import { scanAppImages } from '../../constants/API';

import './index.scss';

const prettyBytes = (num: number) => {
  const unit = Math.pow(2, 10);
  let size = ~~(num / unit / unit);
  if (size < unit) {
    return ` ${size}MB `;
  } else {
    return ` ${(size / unit).toFixed(2)}GB `;
  }
};

@inject((stores: any) => {
  const { systemEnv, appInfo, isFreeze } = stores.workStation;
  const { ipAddress, os, hardwareStatus } = stores.device;

  return {
    systemEnv,
    appInfo,
    isFreeze,
    ipAddress,
    os,
    hardwareStatus,
    getDeviceStatus: () => stores.device.getDeviceStatus(),
    showTerm: () => stores.terminal.show(),
    hideTerm: () => stores.terminal.hide(),
    radarStart: () => stores.radar.start(),
    radarSetTarget: (arr: any[]) => stores.radar.setTarget(arr),
    radarHide: () => stores.radar.hide(),
    radarShow: () => stores.radar.show(),
    radarDispose: () => stores.radar.dispose(),
    resetStateBar: () => stores.workStation.resetStateBar(),
    setStateBar: (str: string, code: number) =>
      stores.workStation.setStateBar(str, code),
    getEnvSupport: (cb: Function) => stores.workStation.getEnvSupport(cb),
    resetEnvData: () => stores.workStation.resetEnvData(),
    setFreeze: (status: boolean) => stores.workStation.setFreeze(status),
    getIpAddress: (cb?: (data: object) => void) =>
      stores.device.getIpAddress(cb),
  };
})
@observer
class ScanView extends React.Component<any> {
  public fresh: boolean = false;
  public timer: any = null;

  public loop() {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.getDeviceStatus();
      this.timer && clearTimeout(this.timer);
      this.loop();
    }, 3000);
  }

  public componentWillMount() {
    this.props.getIpAddress();
    this.props.getDeviceStatus();
    this.loop();
  }

  public componentWillUnmount() {
    this.props.showTerm();
    this.props.radarHide();
    this.timer && clearTimeout(this.timer);
  }

  public componentDidMount() {
    this.props.hideTerm();
    this.props.radarShow();
    this.props.radarSetTarget(scanAppImages);
  }

  public envScanHandle() {
    this.props.setFreeze(true);
    this.props.resetEnvData();
    this.props.radarStart();
    this.props.setStateBar('正在扫描系统...', 2);
    this.fresh = true;
    this.props.getEnvSupport(() => {
      setTimeout(() => {
        this.props.radarDispose();
        this.props.resetStateBar();
        this.props.setFreeze(false);
        notification.success({
          message: '完成',
          description: '已完成对系统开发环境的扫描.',
        });
        this.fresh = false;
      }, 4000);
    });
  }

  public openWebsite(url: string) {
    remote.shell.openExternal(url);
  }

  public render() {
    const {
      appInfo,
      systemEnv,
      isFreeze,
      ipAddress,
      os: { cpu },
      hardwareStatus: { mem },
    } = this.props;

    return (
      <div className="page-scan">
        <div className="title">
          <span>硬件信息 / </span>
          <span className="sub">Hardware Information</span>
        </div>
        <div className="info-content">
          <div className="row">
            <div className="row-item">
              <i className="iconfont">&#xe652;</i>
              <span className="label">处理器：</span>
              {cpu && [
                <span key="brand">{cpu.brand}</span>,
                <span key="speed"> @{cpu.speed}GHz</span>,
                <span className="label" key="core">
                  （{cpu.physicalCores}核心）
                </span>,
              ]}
            </div>
          </div>
          <div className="row">
            <i className="iconfont">&#xe842;</i>
            <span className="label">内存：</span>
            <div className="track">
              <div
                className="bar"
                style={{ width: (mem.used * 100) / mem.total + '%' }}
              />
            </div>
            {mem && (
              <span>
                {prettyBytes(mem.used)}/{prettyBytes(mem.total)}
              </span>
            )}
          </div>
          <div className="row">
            <i className="iconfont">&#xe729;</i>
            <span className="label">网络：</span>
            <span>{ipAddress.local}（本地）</span>
          </div>
          <div className="row">
            <i className="iconfont">&#xe729;</i>
            <span className="label">网络：</span>
            <span>{ipAddress.cip}（互联网）</span>
          </div>
        </div>
        <div className="title">
          <span>系统环境 / </span>
          <span className="sub">System Environment</span>
        </div>
        <div className="dashboard">
          <div className="current-version">当前应用版本: {appInfo.version}</div>
          <div
            className="btn-large scan-btn"
            onClick={e => {
              this.envScanHandle();
            }}
          >
            {!isFreeze ? (
              <span>点击开始扫描</span>
            ) : (
              <span>
                <div className="showbox">
                  <div className="loader">
                    <svg className="circular" viewBox="25 25 50 50">
                      <circle
                        className="path"
                        cx="50"
                        cy="50"
                        r="20"
                        fill="none"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                      />
                    </svg>
                  </div>
                </div>
                正在扫描...
              </span>
            )}
          </div>
          <div className="support-list">
            {systemEnv.map((item: any, index: number) => (
              <div
                className="item"
                key={item.name}
                style={{
                  animation: this.fresh
                    ? `fadeInUp 300ms ease ${index * 1000}ms both`
                    : 'fadeInUp 300ms ease both',
                }}
              >
                <i className={`env-${item.icon_name}`} />
                <div className="env-name">{item.name}</div>
                <div className="env-version">
                  {item.version === null
                    ? '待扫描'
                    : item.version === false
                    ? '未安装'
                    : item.version}
                </div>
                <div className="env-status">
                  {item.version ? (
                    <button className="done">已安装</button>
                  ) : (
                    <button
                      className="download"
                      onClick={() => {
                        this.openWebsite(item.download_lnk);
                      }}
                    >
                      官方下载
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ScanView;
