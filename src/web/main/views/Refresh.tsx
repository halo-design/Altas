import * as React from 'react';
import { withRouter } from 'react-router';

class RefreshView extends React.Component<any, any> {
  public componentDidMount() {
    this.props.history.goBack();
  }

  public render() {
    return '';
  }
}

export default withRouter(RefreshView);
