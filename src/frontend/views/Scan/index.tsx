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
    radarSetDetectFn: (obj: any) => stores.radar.setDetectFn(obj),
    radarPause: () => stores.radar.pause(),
    radarPlay: () => stores.radar.play(),
    radarHide: () => stores.radar.hide(),
    radarShow: () => stores.radar.show(),
    radarDispose: () => stores.radar.dispose(),
    resetStateBar: () => stores.workStation.resetStateBar(),
    setMonitorVisible: (state: boolean) =>
      stores.workStation.setMonitorVisible(state),
    setStateBar: (str: string, code: number) =>
      stores.workStation.setStateBar(str, code),
    getEnvSupport: (cb: Function) => stores.workStation.getEnvSupport(cb),
    setFreeze: (status: boolean) => stores.workStation.setFreeze(status),
  };
})
@observer
class ScanView extends React.Component<any> {
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
    this.props.radarStart();
    this.props.setStateBar('正在扫描系统...', 2);
    this.props.getEnvSupport(() => {
      setTimeout(() => {
        this.props.radarDispose();
        this.props.resetStateBar();
        this.props.setFreeze(false);
        notification.success({
          message: '完成',
          description: '已完成对系统开发环境的扫描.',
        });
      }, 4000);
    });
  }

  public render() {
    const {
      appInfo,
      systemEnv: { env_support },
      isFreeze,
    } = this.props;
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
            <div className="item">
              <div className="env-node" />
              <div className="version">0.0.0</div>
            </div>
          </div>
          {JSON.stringify(env_support)}
        </div>
        <button
          onClick={e => {
            this.props.setMonitorVisible(true);
          }}
        >
          显示监视器
        </button>
        <button
          onClick={e => {
            this.props.setMonitorVisible(false);
          }}
        >
          隐藏监视器
        </button>
        <button
          onClick={e => {
            this.props.showTerm();
          }}
        >
          显示终端
        </button>
        <button
          onClick={e => {
            this.props.hideTerm();
          }}
        >
          隐藏终端
        </button>
        <button
          onClick={e => {
            this.props.radarStart();
          }}
        >
          开始扫描
        </button>
        <button
          onClick={e => {
            this.props.radarPause();
          }}
        >
          暂停扫描
        </button>
        <button
          onClick={e => {
            this.props.radarPlay();
          }}
        >
          继续扫描
        </button>
        <button
          onClick={e => {
            this.props.radarDispose();
          }}
        >
          结束扫描
        </button>
        <button
          onClick={e => {
            this.props.radarHide();
          }}
        >
          隐藏扫描
        </button>
        <button
          onClick={e => {
            this.props.radarShow();
          }}
        >
          显示扫描
        </button>
      </div>
    );
  }
}

export default ScanView;
