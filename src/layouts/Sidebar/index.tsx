import { remote } from 'electron';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo/';
import './index.scss';

const { useState, useEffect } = React;
const { getCurrentWindow } = remote;

export interface ISidebarProps {
  initPath: string;
}

function Sidebar ({ initPath }: ISidebarProps) {
  const [isBlur, setBlur]: [boolean, (isBlur: boolean) => void] = useState(false);

  useEffect(() => {
    const win = getCurrentWindow();
    win.on('blur', () => {
      setBlur(true);
    });

    win.on('focus', () => {
      setBlur(false);
    });
  });

  return (
    <footer className="app-menu-sidebar">
      <Logo
        size={40}
        style={{ margin: '30px auto 20px' }}
        run={isBlur}
        initPath={initPath}
      />
      <div className="menu-button-group">
        <NavLink exact={true} to="/home" className="iconfont" activeClassName="active">&#xec89;</NavLink>
        <NavLink exact={true} to="/upload" className="iconfont" activeClassName="active">&#xe6f5;</NavLink>
        <NavLink exact={true} to="/mine" className="iconfont" activeClassName="active">&#xe602;</NavLink>
        <NavLink exact={true} to="/device" className="iconfont" activeClassName="active">&#xe6ab;</NavLink>
        <NavLink exact={true} to="/face" className="iconfont" activeClassName="active">&#xe71f;</NavLink>
        <NavLink exact={true} to="/sync" className="iconfont" activeClassName="active">&#xe703;</NavLink>
      </div>
      <i className="iconfont setting">&#xe626;</i>
    </footer>
  )
}

export default Sidebar;
