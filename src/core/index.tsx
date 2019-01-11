import { Provider } from 'mobx-react';
import { configureDevtool } from 'mobx-react-devtools';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import store from '../store';
import createMenu from '../utils/menu';
import App from './App';

import '../assets/style/app.scss';

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  configureDevtool({
    graphEnabled: false,
    logEnabled: true,
    logFilter: (change: any) => change.type === 'reaction',
    updatesEnabled: false,
  });
}

document.documentElement.classList.add(process.platform);
createMenu();

ReactDOM.render(
  <Provider {...store}>
    <Router basename="/">
      <App />
    </Router>
  </Provider>,
  document.getElementById("MOUNT_NODE") as HTMLElement
);
