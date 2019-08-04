import * as React from 'react';
import { inject, observer } from 'mobx-react';

import './index.scss';

@inject((stores: any) => {
  return {
    setMonitorVisible: (state: boolean) =>
      stores.workBench.setMonitorVisible(state),
  };
})
@observer
class SyncView extends React.Component<any> {
  public componentDidMount() {
    this.props.setMonitorVisible(false);
  }

  public componentWillUnmount() {
    this.props.setMonitorVisible(true);
  }

  public render() {
    return (
      <div className="sync-page">
        <div className="waiting-for-online">暂未上线，敬请期待.</div>
      </div>
    );
  }
}

export default SyncView;
