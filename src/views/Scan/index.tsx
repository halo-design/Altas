import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Radar from '../../utils/radar';

import './index.scss';

interface IProps {
  showTerm: () => void;
  hideTerm: () => void;
}

@inject((stores: any) => {
  return {
    showTerm: () => stores.terminal.show(),
    hideTerm: () => stores.terminal.hide(),
  };
})
@observer
class HomeView extends React.Component<IProps> {
  public scanEl: any = null;
  public radar: any = null;

  public componentWillUnmount() {
    this.props.showTerm();
    this.radar.destroy();
  }

  public componentDidMount() {
    const radar = new Radar(this.scanEl);
    this.radar = radar;
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
            this.radar.start();
          }}
        >
          开始扫描
        </button>
        <button
          onClick={e => {
            this.radar.pause();
          }}
        >
          暂停扫描
        </button>
        <button
          onClick={e => {
            this.radar.play();
          }}
        >
          继续扫描
        </button>
        <button
          onClick={e => {
            this.radar.destroy();
          }}
        >
          结束扫描
        </button>
        <div
          style={{ height: '400px', width: '400px' }}
          ref={node => {
            this.scanEl = node;
          }}
        />
      </div>
    );
  }
}

export default HomeView;
