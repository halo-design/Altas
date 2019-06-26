import * as React from 'react';
import { DeviceContext } from '../context';

class HeaderView extends React.Component<any, any> {
  static contextType = DeviceContext;

  public componentDidMount() {
    console.log(this.context);
  }

  public render() {
    const { currentWindow } = this.context;
    return (
      <div className="app-header">
        <div className="panel">
          <div className="btn">&#xe7ef;</div>
          <div className="btn">&#xe7ee;</div>
          <div className="btn">&#xe788;</div>
          <div className="btn">&#xe8e8;</div>
          <div
            className="btn"
            onClick={() => {
              currentWindow.close();
            }}
          >
            &#xe7fc;
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderView;
