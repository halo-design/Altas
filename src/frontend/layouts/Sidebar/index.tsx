import { remote } from 'electron';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import Tooltip from 'antd/lib/tooltip';
import Logo from '../Logo';
import './index.scss';

const { useState, useEffect } = React;
const { getCurrentWindow } = remote;

export interface ISidebarProps {
  initPath: string;
}

function Sidebar({ initPath }: ISidebarProps) {
  const [isBlur, setBlur]: [boolean, any] = useState(false);

  useEffect(() => {
    const beBlur = () => {
      setBlur(true);
    };

    const beClear = () => {
      setBlur(false);
    };

    const win = getCurrentWindow();
    win.on('blur', beBlur);
    win.on('focus', beClear);

    return () => {
      win.removeListener('blur', beBlur);
      win.removeListener('focus', beClear);
    };
  });

  return (
    <footer className="app-menu-sidebar">
      <Logo
        size={36}
        style={{ margin: '30px auto 20px' }}
        run={isBlur}
        initPath={initPath}
      />
      <div className="brand-name">ALTAS</div>
      <div className="menu-button-group">
        <NavLink
          exact={true}
          to="/scan"
          className="iconfont"
          activeClassName="active"
        >
          <Tooltip placement="right" title="系统扫描">
            &#xe63b;
          </Tooltip>
        </NavLink>
        <NavLink to="/project" className="iconfont" activeClassName="active">
          <Tooltip placement="right" title="工程管理">
            &#xe754;
          </Tooltip>
        </NavLink>
        <NavLink
          exact={true}
          to="/mine"
          className="iconfont"
          activeClassName="active"
        >
          &#xe602;
        </NavLink>
        <NavLink
          exact={true}
          to="/device"
          className="iconfont"
          activeClassName="active"
        >
          &#xe6ab;
        </NavLink>
        <NavLink
          exact={true}
          to="/face"
          className="iconfont"
          activeClassName="active"
        >
          &#xe71f;
        </NavLink>
        <NavLink
          exact={true}
          to="/tools"
          className="iconfont"
          activeClassName="active"
        >
          &#xe83d;
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
      <i className="iconfont setting">&#xe626;</i>
    </footer>
  );
}

export default Sidebar;
