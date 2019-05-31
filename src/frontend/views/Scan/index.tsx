import { inject, observer } from 'mobx-react';
import * as React from 'react';

import './index.scss';

import node from '../../assets/img/node.png';
import npm from '../../assets/img/npm.png';
import vue from '../../assets/img/vue.png';
import yarn from '../../assets/img/yarn.png';
import eslint from '../../assets/img/eslint.png';
import webpack from '../../assets/img/webpack.png';

const originImages = [
  {
    name: 'node',
    lnk: 'static/' + node,
  },
  {
    name: 'npm',
    lnk: 'static/' + npm,
  },
  {
    name: 'vue',
    lnk: 'static/' + vue,
  },
  {
    name: 'yarn',
    lnk: 'static/' + yarn,
  },
  {
    name: 'eslint',
    lnk: 'static/' + eslint,
  },
  {
    name: 'webpack',
    lnk: 'static/' + webpack,
  },
];

@inject((stores: any) => {
  return {
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
    setMonitorVisible: (state: boolean) =>
      stores.workStation.setMonitorVisible(state),
    setStateBar: (str: string, code: number) =>
      stores.workStation.setStateBar(str, code),
  };
})
@observer
class ScanView extends React.Component<any> {
  public componentWillUnmount() {
    this.props.showTerm();
    this.props.radarHide();
  }

  public componentDidMount() {
    this.props.radarShow();
    this.props.radarSetTarget(originImages);
    this.props.radarSetDetectFn((obj: any) => {
      console.log(obj.name);
    });
  }

  public render() {
    return (
      <div className="page-scan">
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
