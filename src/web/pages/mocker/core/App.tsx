import * as React from 'react';
import { inject, observer } from 'mobx-react';
import TitleBar from '../layouts/TitleBar';
import Monitor from '../layouts/Monitor';
import Mocker from '../layouts/Mocker';

@inject((stores: any) => {
  const { mockerVisible } = stores.monitor;
  return {
    mockerVisible,
  };
})
@observer
class AppView extends React.Component<any, any> {
  public render() {
    const { mockerVisible } = this.props;
    return (
      <div className="app-wrapper">
        <TitleBar />
        <Monitor />
        {mockerVisible && <Mocker />}
      </div>
    );
  }
}

export default AppView;
