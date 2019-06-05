import * as React from 'react';
import createAppMenu from '../utils/createAppMenu';

import Sidebar from '../layouts/Sidebar/';
import WorkStation from '../layouts/WorkStation';
import WinControl from '../layouts/WinControl/';
import Terminal from '../layouts/Terminal/';
import Radar from '../layouts/Radar/';
import { isWin } from '../utils/env';

createAppMenu();

interface IAppProp {
  initPath: string;
}

const App = ({ initPath }: IAppProp): any => {
  const Comp = [
    <Sidebar key="app-sidebar" initPath={initPath} />,
    <WorkStation initPath={initPath} key="work-station">
      <Terminal key="app-terminal" />
      <Radar key="app-radar" />
    </WorkStation>,
  ];

  if (isWin) {
    Comp.push(<WinControl key="app-win-control" />);
  }

  return Comp;
};

export default App;
