import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import createAppMenu from '../utils/createAppMenu';

import Sidebar from '../layouts/Sidebar';
import WinControl from '../layouts/WinControl';

import Device from '../views/Device';
import Home from '../views/Home';
import Mine from '../views/Mine';
import Refresh from '../views/Refresh';
import Sync from '../views/Sync';
import Upload from '../views/Upload';

createAppMenu()
const App = ({ createMenu, initPath, location }: any): any => {
  const isWin = process.platform === 'win32';
  const Comp = [
    <div className="app-content" key="app-main-content">
      <Switch>
        <Route
          path="/home"
          component={Home}
        />
        <Route
          path="/upload"
          component={Upload}
        />
        <Route
          path="/mine"
          component={Mine}
        />
        <Route
          path="/device"
          component={Device}
        />
        <Route
          path="/sync"
          component={Sync}
        />
        <Route
          path="/refresh"
          component={Refresh}
        />
        <Route component={() => <Redirect to={initPath} />} />
      </Switch>
    </div>,
    <Sidebar key="app-sidebar" />,
  ];

  if (isWin) {
    Comp.unshift(<WinControl key='app-win-control' />)
  }
  return Comp;
}

export default App;
