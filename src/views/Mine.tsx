import * as React from 'react';
import * as Reg from '../constants/Reg';
import * as clipBoard from '../utils/clipboard';
import { cancelMultiDownload, download, multiDownload} from '../utils/download';
import { readTxtByLine, selectFile } from '../utils/file';
import messageBox from '../utils/msgBox';
import { detect } from '../utils/system';

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
      download(filePath, (arg: object) => {
        console.log(arg)
      }, {
        openFolderWhenDone: true,
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
    clipBoard.read((arg: string) => {
      this.setPath(arg);
    });
  }

  public componentWillMount () {
    detect((args: any): void => {
      const { appName, version } = args
      console.log(`${appName} ${version}已经启动！`)
    });
  }

  public readLocalTxtByLine (cb: (data: string[]) => void) {
    selectFile({
      properties: ['openFile']
    }, (res: string[] | undefined) => {
      if (!res) {
        return
      }
      const list: string[] = [];
      readTxtByLine(res[0], ({ index, line, status }: any): void => {
        if (line && line.trim()) {
          list.push(line.trim());
        }
        if (status === 'done') {
          cb(list);
        }
      });
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

  public multiDownloadHandle (picArr: string[]) {
    multiDownload(picArr, (e) => {
      console.log('ing', e)
    }, (e) => {
      console.log('done', e)
    }, 10 * 1000)
  }

  public readLocalTxtDownload () {
    this.readLocalTxtByLine((data) => {
      this.multiDownloadHandle(data)
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
      <button onClick={e => { this.readLocalTxtDownload() }}>按行读取下载文件并下载</button>
      <button onClick={cancelMultiDownload}>停止下载队列</button>
    </div>
  }
}

export default MineView;
