import { remote } from 'electron';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import notification from 'antd/lib/notification';

import './index.scss';

import node from '../../assets/img/node.png';
import npm from '../../assets/img/npm.png';
import vue from '../../assets/img/vue.png';
import yarn from '../../assets/img/yarn.png';
import eslint from '../../assets/img/eslint.png';
import webpack from '../../assets/img/webpack.png';
import python from '../../assets/img/python.png';

const originImages = [
  {
    name: 'node',
    lnk: 'static/' + node,
    color: '#46b438',
  },
  {
    name: 'npm',
    lnk: 'static/' + npm,
    color: '#d32e2d',
  },
  {
    name: 'vue',
    lnk: 'static/' + vue,
    color: '#41b883',
  },
  {
    name: 'yarn',
    lnk: 'static/' + yarn,
    color: '#2c8ebb',
  },
  {
    name: 'eslint',
    lnk: 'static/' + eslint,
    color: '#4b32c3',
  },
  {
    name: 'webpack',
    lnk: 'static/' + webpack,
    color: '#8ed6fb',
  },
  {
    name: 'python',
    lnk: 'static/' + python,
    color: '#0075aa',
  },
];

@inject((stores: any) => {
  const { systemEnv, appInfo, isFreeze } = stores.workStation;

  return {
    systemEnv,
    appInfo,
    isFreeze,
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
  };
})
@observer
class ScanView extends React.Component<any> {
  public fresh: boolean = false;

  public componentWillUnmount() {
    this.props.showTerm();
    this.props.radarHide();
  }

  public componentDidMount() {
    this.props.hideTerm();
    this.props.radarShow();
    this.props.radarSetTarget(originImages);
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
    const { appInfo, systemEnv, isFreeze } = this.props;
    return (
      <div className="page-scan">
        <div className="title">
          <span>系统环境 / </span>
          <span className="sub">System Environment</span>
        </div>
        <div className="dashboard">
          <div className="current-version">当前应用版本: {appInfo.version}</div>
          <div
            className="scan-btn"
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
