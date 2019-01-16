import * as React from 'react';
import { aesDecode, aesEncode, CreateContextMenu, readClipboard, writeClipboard } from '../utils/bridge';
import createMenu from '../utils/menu';

export interface IState {
  cryptoStr: string;
  cryptoPswd: string;
  resultStr: string;
}

class SyncView extends React.Component<object, IState> {
  public contextMenu: any = null;

  constructor (props: any) {
    super(props);
    this.state = {
      cryptoPswd: 'qwertyuioplkjhgf',
      cryptoStr: '',
      resultStr: ''
    };
  }

  public componentDidMount () {
    createMenu((tpl: any[]): any[] => {
      const editTpl = {
        label: '编辑',
        submenu: [{
          accelerator: 'CmdOrCtrl+Z',
          label: '撤销',
          role: '撤销'
        }, {
          accelerator: 'Shift+CmdOrCtrl+Z',
          label: '恢复',
          role: '恢复'
        }, {
          type: 'separator'
        }, {
          accelerator: 'CmdOrCtrl+X',
          label: '剪切',
          role: '剪切'
        }, {
          accelerator: 'CmdOrCtrl+C',
          label: '复制',
          role: '复制'
        }, {
          accelerator: 'CmdOrCtrl+V',
          click: (e: any) => {
            readClipboard((arg: string) => {
              this.setState({
                cryptoStr: arg
              })
              console.log('内容已粘贴')
            })
          },
          label: '粘贴',
          role: '粘贴',
        }, {
          accelerator: 'CmdOrCtrl+A',
          label: '全选',
          role: '全选'
        }]
      }

      tpl.unshift(editTpl);

      return tpl
    });

    // 右键菜单
    this.contextMenu = new CreateContextMenu(window, [{
      click: () => { console.log('点击第一个菜单'); },
      label: '第一个菜单'
    }, {
      type: 'separator'
    }, {
      checked: true,
      click: (e: any) => { console.log(e.checked ? '已选中' : '未选中'); },
      label: '第二个菜单',
      type: 'checkbox'
    }]);
  }

  public handleChange = (event: any) => {
    this.setState({
      cryptoStr: event.target.value.trim()
    });
  }
  
  public handlePswdChange = (event: any) => {
    this.setState({
      cryptoPswd: event.target.value.trim()
    });
  }
  
  public encodeHandle = () => {
    aesEncode(this.state.cryptoStr, this.state.cryptoPswd, 'qwertyuioplkjhgf', (data) => {
      console.log(data);
      this.setState({
        resultStr: data
      })
    })
  }
  
  public decodeHandle = () => {
    aesDecode(this.state.cryptoStr, this.state.cryptoPswd, 'qwertyuioplkjhgf', (data) => {
      console.log(data);
      this.setState({
        resultStr: data
      })
    })
  }

  public componentWillUnmount () {
    this.contextMenu.unbind();
    createMenu();
  }

  public render() {
    return (
      <div>
        <input
        type="text"
        onChange={this.handleChange}
        value={this.state.cryptoStr}
        placeholder="请输入加密/解密字符"
      />
        <input
        type="text"
        onChange={this.handlePswdChange}
        value={this.state.cryptoPswd}
        placeholder="请输入加密/解密密码"
      />
      <button onClick={this.encodeHandle}>加密</button>
      <button onClick={this.decodeHandle}>解密</button>
      <div>
        加密/解密结果：
        <input onClick={(e: any) => { writeClipboard(e.target.value) }} value={this.state.resultStr} readOnly={true} />
      </div>
      </div>
    );
  }
}

export default SyncView;
