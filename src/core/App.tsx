import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import Home from '../views/Home';
import Mine from '../views/Mine';

const App = () => (
  <div className="app-core">
    <Switch>
      <Route
        path="/home"
        component={Home}
      />
      <Route
        path="/mine"
        component={Mine}
      />
      <Route component={() => <Redirect to="/home" />} />
    </Switch>
    <Sidebar />
  </div>
)

export default App;
