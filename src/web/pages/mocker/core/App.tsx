import * as React from 'react';
import TitleBar from '../layouts/TitleBar';
import Monitor from '../layouts/Monitor';
import Mocker from '../layouts/Mocker';

class AppView extends React.Component<any, any> {
  public render() {
    return (
      <div className="app-wrapper">
        <TitleBar />
        <Monitor />
        <Mocker />
      </div>
    );
  }
}

export default AppView;
