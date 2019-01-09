import * as React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <footer className="app-menu-sidebar">
    <div className="app-logo" />
    <div className="menu-button-group">
      <NavLink exact={true} to="/home">home</NavLink>
      <NavLink exact={true} to="/upload">upload</NavLink>
      <NavLink exact={true} to="/mine">mine</NavLink>
      <NavLink exact={true} to="/sync">sync</NavLink>
    </div>
  </footer>
)

export default Sidebar;