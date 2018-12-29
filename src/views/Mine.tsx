import * as React from 'react';
import { ipcRenderer } from 'electron';
// const { dialog } = require('electron').remote;

export interface MineState {
  filePath: string;
}

class MineView extends React.Component {
  state: MineState = {
    filePath: ''
  };

  public download = () => {
    const { filePath } = this.state;
    const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ig;

    if (filePath && reg.test(filePath)) {
      ipcRenderer.send('file-download', filePath);
    } else {
      // dialog.showOpenDialog({
      //   defaultPath: '../Desktop'
      // })
      ipcRenderer.send('on-dialog-message', {
        buttons: ['确定'],
        title: '提示',
        message: '路径输入有误',
        detail: '请填写正确文件下载路径！'
      });
    }
  };

  public handleNameChange = (e: any) => {
    this.setState({
      filePath: e.target.value.trim()
    });
  };

  public componentWillMount () {
    ipcRenderer.send('ipc-start');

    ipcRenderer.once('ipc-running', (event: any, arg: { appName: string, version: string }) => {
      const { appName, version } = arg
      console.log(`${appName} ${version}已经启动！`)
    });

    ipcRenderer.on('on-download-state', (event: any, arg: object) => {
      console.log(arg)
    })
  };

  public componentWillUnmount () {
    ipcRenderer.removeAllListeners('on-download-state');
  };

  public render() {
    return <div className="page-mine">
      <input type="text" name="remotePath" defaultValue={this.state.filePath} onChange={this.handleNameChange} />
      <button onClick={this.download}>点击下载文件</button>
    </div>;
  };
}

export default MineView;
