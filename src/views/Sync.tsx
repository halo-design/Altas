import { remote } from 'electron';
import * as React from 'react';
const { Menu, MenuItem, getCurrentWindow } = remote;

class SyncView extends React.Component {

  public componentDidMount () {
    // 右键菜单
    const menu = new Menu();
    menu.append(new MenuItem({ label: 'MenuItem1', click: () => { console.log('item 1 clicked'); } }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));

    window.addEventListener('contextmenu', (e: any) => {
      e.preventDefault();
      menu.popup(getCurrentWindow());
    }, false);
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
