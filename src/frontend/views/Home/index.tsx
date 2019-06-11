import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { createWindow, closeWindow } from '../../utils/createWindow';

import './index.scss';

interface IProps {
  shell: (s: string) => void;
  clear: () => void;
  kill: () => void;
  scrollToBottom: () => void;
}

@inject((stores: any) => {
  return {
    shell: (s: string) => stores.terminal.shell(s),
    clear: () => stores.terminal.clear(),
    kill: () => stores.terminal.kill(),
    scrollToBottom: () => stores.terminal.scrollToBottom(),
  };
})
@observer
class HomeView extends React.Component<IProps> {
  public win_uid: string = '';

  public createWin() {
    createWindow(
      {
        pathname: 'renderer/info.html',
        hash: '',
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
        <button
          onClick={e => {
            this.props.clear();
          }}
        >
          清除控制台
        </button>
        <button
          onClick={e => {
            this.props.shell('ls');
          }}
        >
          执行命令
        </button>
        <button
          onClick={e => {
            this.props.kill();
          }}
        >
          关闭
        </button>
      </div>
    );
  }
}

export default HomeView;
