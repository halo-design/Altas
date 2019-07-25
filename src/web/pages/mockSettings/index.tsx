import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './core/App';

import '../markdown/index.scss';
import './styles/index.scss';

ReactDOM.render(<App />, document.getElementById('MOUNT_NODE') as HTMLElement);
