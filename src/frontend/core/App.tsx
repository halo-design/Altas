import * as React from 'react';
import createAppMenu from '../utils/createAppMenu';

import Sidebar from '../layouts/Sidebar/';
import WorkStation from '../layouts/WorkStation';
import WinControl from '../layouts/WinControl/';
import Terminal from '../layouts/Terminal/';
import Radar from '../layouts/Radar/';

createAppMenu();

interface IAppProp {
  initPath: string;
}

const App = ({ initPath }: IAppProp): any => {
  const isWin = process.platform === 'win32';
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
