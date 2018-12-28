import * as React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <footer>
    <NavLink exact to="/home">home</NavLink>
    <NavLink exact to="/mine">mine</NavLink>
    <NavLink exact to="/sync">sync</NavLink>
  </footer>
)

export default Sidebar;