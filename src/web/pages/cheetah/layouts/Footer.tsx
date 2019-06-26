import * as React from 'react';
import { DeviceContext } from '../context';

class FooterView extends React.Component<any, any> {
  static contextType = DeviceContext;

  public render() {
    const { target } = this.context;
    return (
      <div className="app-footer">
        <div className="portal">
          <div className="btn">&#xe7dd;</div>
          <div className="ipt">
            <input type="text" defaultValue={target} />
          </div>
          <div className="btn">&#xe7ee;</div>
        </div>
      </div>
    );
  }
}

export default FooterView;
