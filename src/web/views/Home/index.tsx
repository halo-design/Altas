import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { openDeviceDebug, closeWindow } from '../../bridge/createWindow';

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
    openDeviceDebug(
      {
        target: 'https://www.baidu.com',
        width: 414,
        height: 736,
        useragent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        preload: './devTools/dev-tools.js',
      },
      (params: any) => {
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
        <br />
        <br />
        <br />
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
