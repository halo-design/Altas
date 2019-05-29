import * as React from 'react';
import { createWindow, closeWindow } from '../../utils/createWindow';

import './index.scss';

class HomeView extends React.Component {
  public win_uid: string = '';

  public createWin() {
    createWindow(
      {
        pathname: 'renderer/index.html',
        hash: '#/upload',
      },
      {
        width: 300,
        height: 200,
        resizable: false,
        movable: true,
        maximizable: false,
        minimizable: false,
      },
      params => {
        this.win_uid = params.win_uid;
      }
    );
  }

  public closeWin() {
    if (this.win_uid) {
      closeWindow(this.win_uid);
    }
  }

  public render() {
    return (
      <div className="page-home">
        <button
          onClick={e => {
            this.createWin();
          }}
        >
          打开新窗口
        </button>
        <button
          onClick={e => {
            this.closeWin();
          }}
        >
          关闭新窗口
        </button>
      </div>
    );
  }
}

export default HomeView;
