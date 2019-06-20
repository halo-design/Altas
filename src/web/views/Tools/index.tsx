import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { openDeviceDebug, closeWindow } from '../../bridge/createWindow';
import { allDeviceObject } from '../../config/DeviceDescriptors';

import './index.scss';

@inject((stores: any) => {
  return {
    useDebugDevice: stores.terminal.useDebugDevice,
    shell: (s: string) => stores.terminal.shell(s),
    clear: () => stores.terminal.clear(),
    kill: () => stores.terminal.kill(),
    scrollToBottom: () => stores.terminal.scrollToBottom(),
    setMonitorVisible: (state: boolean) =>
      stores.workStation.setMonitorVisible(state),
  };
})
@observer
class ToolsView extends React.Component<any> {
  public win_uid: string = '';

  public createWin() {
    openDeviceDebug(
      {
        target: 'https://mobile.ant.design/kitchen-sink/',
        preload: './devTools/dev-tools.js',
        descriptors: allDeviceObject[this.props.useDebugDevice],
        insertCSS: `
          body::-webkit-scrollbar {
            width: 4px;
          }
          
          body::-webkit-scrollbar-thumb {
            background-color: rgb(220, 220, 220);
          }
          
          body::-webkit-scrollbar-track-piece {
            background-color: transparent;
          }
        `,
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

  public componentDidMount() {
    this.props.setMonitorVisible(false);
  }

  public componentWillUnmount() {
    this.props.setMonitorVisible(true);
  }

  public render() {
    return (
      <div className="page-tools">
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

export default ToolsView;
