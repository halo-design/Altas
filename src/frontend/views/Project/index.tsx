import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, NavLink, Redirect } from 'react-router-dom';
import Create from '../Create';
import Runner from '../Runner';

import './index.scss';

@inject((stores: any) => {
  return {
    showTerm: () => stores.terminal.show(),
    hideRadar: () => stores.radar.hide(),
  };
})
@observer
class ProjectView extends React.Component<any, any> {
  public componentDidMount() {
    this.props.showTerm();
    this.props.hideRadar();
  }

  public render() {
    return (
      <div className="page-project">
        <div className="app-switch">
          <NavLink
            exact={true}
            to="/project/create"
            className="item-btn"
            activeClassName="active"
          >
            创建项目
          </NavLink>
          <NavLink
            exact={true}
            to="/project/runner"
            className="item-btn"
            activeClassName="active"
          >
            运行项目
          </NavLink>
        </div>
        <Switch>
          <Route path="/project/create" component={Create} />
          <Route path="/project/runner" component={Runner} />
          <Route
            path="/project"
            component={() => <Redirect to="/project/create" />}
          />
        </Switch>
      </div>
    );
  }
}

export default ProjectView;
