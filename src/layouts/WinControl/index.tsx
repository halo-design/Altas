import * as React from 'react';
import { win } from '../../utils/bridge';
import './index.scss';

export interface IWinCtrlState {
  isMax: boolean;
}

class WinControlView extends React.Component<object, IWinCtrlState> {
  public toogleEl: HTMLElement | null = null

  constructor (props: any) {
    super(props);
    this.state = {
      isMax: win.isMax()
    };
  }

  public min () {
    win.minimize();
  }

  public maxToogle = () => {
    if (win.isMax()){
      win.unmaximize();
      if (this.toogleEl) {
        this.toogleEl.innerHTML = '&#xe604;'
      }
    } else {
      win.maximize();
      if (this.toogleEl) {
        this.toogleEl.innerHTML = '&#xe625;'
      }
    }
  }

  public close () {
    win.close();
  }

  public render() {
    return (
      <div className="app-win-control">
        <button onClick={this.min} className="iconfont min">&#xe607;</button>
        <button
          ref={node => { this.toogleEl = node }}
          onClick={this.maxToogle}
          className="iconfont toogle"
        >&#xe604;</button>
        <button onClick={this.close} className="iconfont close">&#xe762;</button>
      </div>
    )
  }
}

export default WinControlView
