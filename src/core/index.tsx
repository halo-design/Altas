import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import "../assets/style/app.scss";

ReactDOM.render(
  <App />,
  document.getElementById('MOUNT_NODE') as HTMLElement
);

console.log(`We are using Node.js${process.versions.node}`);
console.log(`Chromium${process.versions.chrome}`);
console.log(`and Electron${process.versions.electron}`);
