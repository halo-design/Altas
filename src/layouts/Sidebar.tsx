import * as React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <footer className="app-menu-sidebar">
    <div className="app-logo" />
    <div className="menu-button-group">
      <NavLink exact={true} to="/home" activeClassName="active">home</NavLink>
      <NavLink exact={true} to="/upload" activeClassName="active">upload</NavLink>
      <NavLink exact={true} to="/mine" activeClassName="active">mine</NavLink>
      <NavLink exact={true} to="/device" activeClassName="active">device</NavLink>
      <NavLink exact={true} to="/sync" activeClassName="active">sync</NavLink>
    </div>
  </footer>
)

export default Sidebar;