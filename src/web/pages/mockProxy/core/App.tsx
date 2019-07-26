import * as React from 'react';
import TitleBar from '../layouts/TitleBar';
import Monitor from '../layouts/Monitor';

class AppView extends React.Component<any, any> {
  public render() {
    return (
      <div className="app-wrapper">
        <TitleBar />
        <Monitor />
      </div>
    );
  }
}

export default AppView;
