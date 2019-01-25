import { remote } from 'electron';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo/';
import './index.scss'

const { getCurrentWindow } = remote;

export interface ISidebarProps {
  initPath: string;
}

export interface ISidebarState {
  isBlur: boolean;
}

class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  constructor (props: any) {
    super(props);
    this.state = {
      isBlur: true
    }

    const win = getCurrentWindow();
    win.on('blur', () => {
      this.setState({
        isBlur: true
      })
    });

    win.on('focus', () => {
      this.setState({
        isBlur: false
      })
    });
  }

  public render () {
    return (
      <footer className="app-menu-sidebar">
        <Logo
          size={40}
          style={{ margin: '30px auto 20px' }}
          run={this.state.isBlur}
          initPath={this.props.initPath}
        />
        <div className="menu-button-group">
          <NavLink exact={true} to="/home" className="iconfont" activeClassName="active">&#xec89;</NavLink>
          <NavLink exact={true} to="/upload" className="iconfont" activeClassName="active">&#xe6f5;</NavLink>
          <NavLink exact={true} to="/mine" className="iconfont" activeClassName="active">&#xe602;</NavLink>
          <NavLink exact={true} to="/device" className="iconfont" activeClassName="active">&#xe6ab;</NavLink>
          <NavLink exact={true} to="/tools" className="iconfont" activeClassName="active">&#xe83d;</NavLink>
          <NavLink exact={true} to="/sync" className="iconfont" activeClassName="active">&#xe703;</NavLink>
        </div>
        <i className="iconfont setting">&#xe626;</i>
      </footer>
    )
  }
}

export default Sidebar;