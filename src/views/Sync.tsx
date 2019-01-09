import * as React from 'react';
import { CreateContextMenu } from '../utils/bridge';

class SyncView extends React.Component {
  public contextMenu: any = null;

  public componentDidMount () {
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
