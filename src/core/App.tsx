import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import Home from '../views/Home';
import Mine from '../views/Mine';
import Sync from "../views/Sync";
import Upload from '../views/Upload';

// const Sync = React.lazy(() => import('../views/Sync'));

const App = () => (
  <div className="app-core">
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
        path="/sync"
        component={Sync}
      />
      <Route component={() => <Redirect to="/home" />} />
    </Switch>
    <Sidebar />
  </div>
)

export default App;
