import * as React from 'react';
import { aesDecode, aesEncode, CreateContextMenu, readClipboard, writeClipboard } from '../utils/bridge';
import createMenu from '../utils/menu';

class SyncView extends React.Component {
  public contextMenu: any = null;
  public focusElement: any = null;
  public cryptoStrEl: any = null;
  public cryptoPswdrEl: any = null;
  public cryptoRztEl: any = null;

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
          click: (e: any) => {
            if (this.focusElement) {
              writeClipboard(this.focusElement.value);
              console.log('内容已复制');
            }
          },
          label: '复制',
          role: '复制'
        }, {
          accelerator: 'CmdOrCtrl+V',
          click: (e: any) => {
            readClipboard((arg: string) => {
              if (this.focusElement) {
                this.focusElement.value = arg;
                console.log('内容已粘贴');
              }
            })
          },
          label: '粘贴',
          role: '粘贴',
        }, {
          accelerator: 'CmdOrCtrl+A',
          click: (e: any) => {
            if (this.focusElement) {
              this.focusElement.select();
              console.log('内容已全选');
            }
          },
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

  public focusHandle = (event: any) => {
    this.focusElement = event.target;
  }
  
  public encodeHandle = () => {
    console.log(this.cryptoStrEl.value, this.cryptoPswdrEl.value)
    aesEncode(this.cryptoStrEl.value, this.cryptoPswdrEl.value, 'qwertyuioplkjhgf', (data) => {
      this.cryptoRztEl.value = data;
    })
  }
  
  public decodeHandle = () => {
    aesDecode(this.cryptoStrEl.value, this.cryptoPswdrEl.value, 'qwertyuioplkjhgf', (data) => {
      this.cryptoRztEl.value = data;
    })
  }

  public componentWillUnmount () {
    this.contextMenu.unbind();
    createMenu();
  }

  public render() {
    return (
      <div>
        <br />
        <input
        type="text"
        onFocus={e => { this.focusHandle(e) }}
        ref={node => { this.cryptoStrEl = node }}
        placeholder="请输入加密/解密字符"
        />
        <input
        type="text"
        onFocus={e => { this.focusHandle(e) }}
        ref={node => { this.cryptoPswdrEl = node }}
        placeholder="请输入加密/解密密码"
        defaultValue="qwertyuioplkjhgf"
      />
      <button onClick={this.encodeHandle}>加密</button>
      <button onClick={this.decodeHandle}>解密</button>
      <div>
        加密/解密结果：
        <input
          type="text"
          ref={node => { this.cryptoRztEl = node }}
          onFocus={e => { this.focusHandle(e) }}
        />
      </div>
      </div>
    );
  }
}

export default SyncView;
