import * as React from 'react';
import createAppMenu from '../bridge/createAppMenu';

import Sidebar from '../layouts/Sidebar';
import WorkBench from '../layouts/WorkBench';
import WinControl from '../layouts/WinControl';
import Terminal from '../layouts/Terminal';
import Radar from '../layouts/Radar';
import ServerMonitor from '../layouts/serverMonitor';
import { isWin } from '../bridge/env';

createAppMenu();

interface IAppProp {
  initPath: string;
}

const App = ({ initPath }: IAppProp): any => {
  const Comp = [
    <WorkBench initPath={initPath} key="work-bench">
      <Terminal />
      <Radar />
    </WorkBench>,
    <ServerMonitor key="app-server-monitor" />,
    <Sidebar key="app-sidebar" initPath={initPath} />,
  ];

  if (isWin) {
    Comp.push(<WinControl key="app-win-control" />);
  }

  return Comp;
};

export default App;
