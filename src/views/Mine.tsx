// import { ipcRenderer } from 'electron';
import * as React from 'react';
import IPC, { clipboard, download, messageBox, selectFile } from '../utils/bridge';
// import { HtmlAttributes } from 'csstype';

export interface IState {
  filePath: string;
}

class MineView extends React.Component<object, IState> {
  constructor (props: any) {
    super(props);
    this.state = {
      filePath: ''
    };
  };

  public testPath = (path: string) => {
    const urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ig;
    return urlReg.test(path);
  };

  public clearPath = () => {
    this.setState({
      filePath: ''
    });
  };

  public setPath = (path: string) => {
    this.setState({
      filePath: path.trim()
    });
  }

  public handleDownload = () => {
    const { filePath } = this.state;
    if (this.testPath(filePath)) {
      console.log(filePath);
      download.trigger(filePath, {
        openFolderWhenDone: true,
        saveAs: true,
      });
    } else {
      this.clearPath();
    }
  };

  public handleChange = (event: any) => {
    this.setPath(event.target.value);
  };

  public handlePaste = (event: any) => {
    event.preventDefault();
    clipboard.trigger();
  };

  public componentWillMount () {
    IPC.test();

    IPC.detect((arg: { appName: string, version: string }) => {
      const { appName, version } = arg
      console.log(`${appName} ${version}已经启动！`)
    });

    clipboard.bind((arg: string) => {
      this.setPath(arg);
    });

    download.bind((arg: object) => {
      console.log(arg)
    });
  };

  public handleSelectPath () {
    selectFile({
      properties: ['openDirectory', 'openFile']
    }, res => {
      console.log(res);
    })
  };

  public showMessageBox () {
    messageBox({
      betterButtons: [{
        isDefault: true,
        label: 'Default Button',
      }, {
        isCancel: true,
        label: 'Cancel Button',
      }, {
        data: {
          arbitrary: true
        },
        label: 'Action Button'
      }],
      message: 'Async',
    })
  }

  public componentWillUnmount () {
    clipboard.unbind();
    download.unbind();
  };

  public render() {
    return <div className="page-mine">
      <input
        type="text"
        name="remotePath"
        onPaste={this.handlePaste}
        onChange={this.handleChange}
        value={this.state.filePath}
      />
      <button onClick={this.handleDownload}>点击下载文件</button>
      <button onClick={this.handlePaste}>粘贴剪切板链接</button>
      <button onClick={this.handleSelectPath}>选择路径</button>
      <button onClick={this.showMessageBox}>弹出消息框</button>
    </div>;
  };
}

export default MineView;
