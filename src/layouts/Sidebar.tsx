import * as React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <footer className="app-menu-sidebar">
    <div className="app-logo" />
    <div className="menu-button-group">
      <NavLink exact={true} to="/home" className="iconfont" activeClassName="active">&#xec89;</NavLink>
      <NavLink exact={true} to="/upload" className="iconfont" activeClassName="active">&#xe725;</NavLink>
      <NavLink exact={true} to="/mine" className="iconfont" activeClassName="active">&#xe741;</NavLink>
      <NavLink exact={true} to="/device" className="iconfont" activeClassName="active">&#xe602;</NavLink>
      <NavLink exact={true} to="/tools" className="iconfont" activeClassName="active">&#xe83d;</NavLink>
      <NavLink exact={true} to="/sync" className="iconfont" activeClassName="active">&#xe626;</NavLink>
    </div>
  </footer>
)

export default Sidebar;