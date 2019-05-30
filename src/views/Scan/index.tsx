import { inject, observer } from 'mobx-react';
import * as React from 'react';

import './index.scss';

@inject((stores: any) => {
  return {
    showTerm: () => stores.terminal.show(),
    hideTerm: () => stores.terminal.hide(),
    radarStart: () => stores.radar.start(),
    radarPause: () => stores.radar.pause(),
    radarPlay: () => stores.radar.play(),
    radarHide: () => stores.radar.hide(),
    radarShow: () => stores.radar.show(),
    radarDispose: () => stores.radar.dispose(),
  };
})
@observer
class ScanView extends React.Component<any> {
  public componentWillUnmount() {
    this.props.showTerm();
  }

  public componentDidMount() {
    this.props.radarDispose();
  }

  public render() {
    return (
      <div className="page-scan">
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
