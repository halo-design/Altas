import * as React from 'react';
import createAppMenu from '../bridge/createAppMenu';

import Sidebar from '../layouts/Sidebar';
import WorkBench from '../layouts/WorkBench';
import WinControl from '../layouts/WinControl';
import Terminal from '../layouts/Terminal';
import Radar from '../layouts/Radar';
import { isWin } from '../bridge/env';

createAppMenu();

interface IAppProp {
  initPath: string;
}

const App = ({ initPath }: IAppProp): any => {
  const Comp = [
    <WorkBench initPath={initPath} key="work-bench">
      <Terminal key="app-terminal" />
      <Radar key="app-radar" />
    </WorkBench>,
    <Sidebar key="app-sidebar" initPath={initPath} />,
  ];

  if (isWin) {
    Comp.push(<WinControl key="app-win-control" />);
  }

  return Comp;
};

export default App;
