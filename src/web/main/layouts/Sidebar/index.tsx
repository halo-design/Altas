import { remote } from 'electron';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import Tooltip from 'antd/lib/tooltip';
import Logo from '../Logo';
import { cheetahSimulator } from '../../bridge/createWindow';
import { allDeviceObject } from '../../config/DeviceDescriptors';
import { isWin } from '../../bridge/env';
import { cheetahSimulatorIndex } from '../../constants/API';

import './index.scss';

const { getCurrentWindow } = remote;
const win = getCurrentWindow();

@inject((stores: any) => {
  const {
    terminal: { useDebugDevice },
  } = stores;

  return {
    useDebugDevice,
  };
})
@observer
class SidebarView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      isBlur: false,
    };
  }

  public setBlur(state: boolean) {
    this.setState({
      isBlur: state,
    });
  }

  public openCheetahDevice() {
    cheetahSimulator({
      target: cheetahSimulatorIndex,
      descriptors: allDeviceObject[this.props.useDebugDevice],
    });
  }

  public componentDidMount() {
    win.on('blur', () => this.setBlur(true));
    win.on('focus', () => this.setBlur(false));
  }

  public render() {
    const { initPath } = this.props;
    return (
      <footer className="app-menu-sidebar">
        <Logo
          size={36}
          style={{ margin: `${isWin ? 20 : 30}px auto 20px` }}
          run={this.state.isBlur}
          initPath={initPath}
        />
        <div className="brand-name">ALTAS</div>
        <div className="menu-button-group-wrapper">
          <div className="menu-button-group">
            <NavLink
              exact={true}
              to="/scan"
              className="iconfont"
              activeClassName="active"
            >
              <Tooltip placement="right" title="系统扫描" mouseEnterDelay={2}>
                &#xe63b;
              </Tooltip>
            </NavLink>
            <NavLink
              to="/project"
              className="iconfont"
              activeClassName="active"
            >
              <Tooltip placement="right" title="工程管理" mouseEnterDelay={2}>
                &#xe754;
              </Tooltip>
            </NavLink>
            <NavLink to="/store" className="iconfont" activeClassName="active">
              <Tooltip placement="right" title="组件商城" mouseEnterDelay={2}>
                &#xe629;
              </Tooltip>
            </NavLink>
            <NavLink
              exact={true}
              to="/tools"
              className="iconfont"
              activeClassName="active"
            >
              <Tooltip placement="right" title="常用工具" mouseEnterDelay={2}>
                &#xe83d;
              </Tooltip>
            </NavLink>
            <NavLink
              exact={true}
              to="/sync"
              className="iconfont"
              activeClassName="active"
            >
              &#xe703;
            </NavLink>
          </div>
          <div className="menu-button-group">
            <a
              className="iconfont"
              onClick={() => {
                this.openCheetahDevice();
              }}
            >
              <Tooltip placement="right" title="猎豹调试器">
                &#xe61f;
              </Tooltip>
            </a>
            <NavLink
              exact={true}
              to="/face"
              className="iconfont"
              activeClassName="active"
            >
              &#xe670;
            </NavLink>
          </div>
        </div>
        <NavLink exact={true} to="/settings" className="iconfont setting">
          <Tooltip placement="right" title="基本设置">
            &#xe626;
          </Tooltip>
        </NavLink>
      </footer>
    );
  }
}

export default SidebarView;
