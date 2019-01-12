import * as React from 'react';
import { CreateContextMenu } from '../utils/bridge';
import createMenu from '../utils/menu';

class SyncView extends React.Component {
  public contextMenu: any = null;

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
          label: '粘贴',
          role: '粘贴'
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

  public componentWillUnmount () {
    this.contextMenu.unbind();
    createMenu();
  }

  public render() {
    return (
      <div>
        SyncView
      </div>
    );
  }
}

export default SyncView;
