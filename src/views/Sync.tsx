import * as React from 'react';
import withMenu from '../components/withMenu';
import { aesDecode, aesEncode, CreateContextMenu } from '../utils/bridge';

export interface ISyncProps {
  history: any;
  createMenu: (editor?: (tpl: any[]) => any[]) => void;
}

class SyncView extends React.Component<ISyncProps> {
  public contextMenu: any = null;
  public cryptoStrEl: any = null;
  public cryptoPswdrEl: any = null;
  public cryptoRztEl: any = null;
  public notify: any = null;

  public componentDidMount () {
    this.props.createMenu((tpl) => {
      const editTpl = {
        label: '独占',
        submenu: [{
          accelerator: 'CmdOrCtrl+J',
          click: (e: any) => {
            this.notify = new Notification('独占功能');
          },
          label: '功能',
          role: '功能'
        }]
      }

      tpl.unshift(editTpl);

      return tpl
    });

    // 右键菜单
    this.contextMenu = new CreateContextMenu(window, [{
      click: () => { this.props.history.push('/refresh'); },
      label: '刷新'
    }, {
      type: 'separator'
    }, {
      checked: true,
      click: (e: any) => { console.log(e.checked ? '已选中' : '未选中'); },
      label: '第二个菜单',
      type: 'checkbox'
    }]);
  }
  
  public encodeHandle = () => {
    console.log(this.cryptoStrEl.value, this.cryptoPswdrEl.value)
    aesEncode(this.cryptoStrEl.value, this.cryptoPswdrEl.value, (data) => {
      this.cryptoRztEl.value = data;
    })
  }
  
  public decodeHandle = () => {
    aesDecode(this.cryptoStrEl.value, this.cryptoPswdrEl.value, (data) => {
      this.cryptoRztEl.value = data;
    })
  }

  public componentWillUnmount () {
    this.contextMenu.unbind();
    this.props.createMenu();
  }

  public render() {
    return (
      <div>
        <br />
        <input
        type="text"
        ref={node => { this.cryptoStrEl = node }}
        placeholder="请输入加密/解密字符"
        />
        <input
        type="text"
        ref={node => { this.cryptoPswdrEl = node }}
        placeholder="请输入加密/解密密码"
      />
      <button onClick={this.encodeHandle}>加密</button>
      <button onClick={this.decodeHandle}>解密</button>
      <div>
        加密/解密结果：
        <input
          type="text"
          ref={node => { this.cryptoRztEl = node }}
        />
      </div>
      </div>
    );
  }
}

export default withMenu(SyncView);
