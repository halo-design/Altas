import * as React from 'react';
import TitleBar from '../layouts/TitleBar';

class AppView extends React.Component<any, any> {
  public render() {
    return (
      <div className="app-wrapper">
        <TitleBar />
      </div>
    );
  }
}

export default AppView;
