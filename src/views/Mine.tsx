import * as React from 'react';
// import { ipcRenderer } from 'electron';

export interface MineState {
  updateStste: string;
}

class MineView extends React.Component {
  state: MineState = {
    updateStste: 'ready-to-check'
  };

  public downloadUpdate = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // ipcRenderer.send('get-update-cache');
  };

  public showChangelog = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // ipcRenderer.send('read-changelog');
  };

  public reloadWindow = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // ipcRenderer.send('reload-window');
  };

  public componentWillMount () {
    // ipcRenderer.send('check-update');
    // ipcRenderer.on('get-update-state', (event: any, arg: string) => {
    //   this.setState({
    //     updateStste: arg
    //   });
    // });

    // ipcRenderer.on('get-changelog', (event: any, arg: object) => {
    //   console.log(arg)
    // });

    // ipcRenderer.on('zip-download-progress', (event: any, arg: object) => {
    //   console.log(`正在下载：${arg.percent * 100}%` )
    // });
  };

  public componentWillUnmount () {
    // ipcRenderer.removeListener('get-update-state', () => {})
    // ipcRenderer.removeListener('get-changelog', () => {})
    // ipcRenderer.removeListener('zip-download-progress', () => {})
  };

  public render() {
    const { updateStste } = this.state;
    return <div className="page-mine">
      { updateStste === 'need-to-download' && <div>有新的版本更新</div> }
      { updateStste === 'need-to-download' && <button onClick={this.downloadUpdate}>点击升级</button> }
      { updateStste === 'ready-to-reload' && <button onClick={this.reloadWindow}>点击重启以更新</button> }
      { updateStste === 'already-latest' && <div>已是最新版本</div> }
      <button onClick={this.showChangelog}>点击查看更新日志</button>
    </div>;
  };
}

export default MineView
