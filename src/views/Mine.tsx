import * as React from 'react';
import * as Reg from '../constants/Reg';
import { detect, download, messageBox, multiDownload, readClipboard, selectFile } from '../utils/bridge';

export interface IState {
  filePath: string;
}

class MineView extends React.Component<object, IState> {
  constructor (props: any) {
    super(props);
    this.state = {
      filePath: ''
    };
  }

  public testPath = (path: string) => {
    return Reg.url.test(path);
  }

  public clearPath = () => {
    this.setState({
      filePath: ''
    });
  }

  public setPath = (path: string) => {
    this.setState({
      filePath: path.trim()
    });
  }

  public handleDownload = () => {
    const { filePath } = this.state;
    if (this.testPath(filePath)) {
      console.log(filePath);
      download(filePath, {
        openFolderWhenDone: true,
        saveAs: true,
      }, (arg: object) => {
        console.log(arg)
      });
    } else {
      this.clearPath();
    }
  }

  public handleChange = (event: any) => {
    this.setPath(event.target.value);
  }

  public handlePaste = (event: any) => {
    event.preventDefault();
    readClipboard((arg: string) => {
      this.setPath(arg);
    });
  }

  public componentWillMount () {
    detect((args: any): void => {
      const { appName, version } = args
      console.log(`${appName} ${version}已经启动！`)
    });
  }

  public handleSelectPath () {
    selectFile({
      properties: ['openDirectory', 'openFile']
    }, res => {
      console.log(res);
    });
  }

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
    });
  }

  public multiDownloadHandle () {
    const picArr = [
      'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-724790.jpg',
      'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-726345.jpg',
      'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-726299.jpg',
      'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-722952.jpg',
      'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-723212.jpg'
    ];

    multiDownload(picArr, (e) => {
      console.log('ing', e)
    }, (e) => {
      console.log('done', e)
    })
  }

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
      <br />
      <button onClick={this.multiDownloadHandle}>点击下载队列</button>
    </div>
  }
}

export default MineView;
