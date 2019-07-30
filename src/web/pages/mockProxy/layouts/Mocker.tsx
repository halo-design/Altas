import * as React from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

@inject((stores: any) => {
  const { mockerVisible } = stores.monitor;
  return {
    mockerVisible,
  };
})
@observer
class MockerView extends React.Component<any> {
  public render() {
    const { mockerVisible } = this.props;

    return (
      <div className={classNames('app-mocker', { hide: !mockerVisible })}>
        <h1>123</h1>
      </div>
    );
  }
}

export default MockerView;
