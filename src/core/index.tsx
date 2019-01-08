import { Provider } from 'mobx-react';
import { configureDevtool } from 'mobx-react-devtools';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import store from '../store';
import App from './App';

import '../assets/style/app.scss';

configureDevtool({
  graphEnabled: false,
  logEnabled: true,
  logFilter: change => change.type === 'reaction',
  updatesEnabled: false,
});

const clinetHeight = document.documentElement.clientHeight;

ReactDOM.render(
  <Provider {...store}>
    <Router basename="/">
      <div className="app-container-wrap" style={{ height: `${clinetHeight}px` }}>
        <App />
      </div>
    </Router>
  </Provider>,
  document.getElementById("MOUNT_NODE") as HTMLElement
);
