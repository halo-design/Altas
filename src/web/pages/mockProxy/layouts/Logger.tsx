import * as React from 'react';
import { inject, observer } from 'mobx-react';

@inject((stores: any) => {
  return {
    init: (el: HTMLElement) => stores.monitor.initMonitor(el),
  };
})
@observer
class LoggerView extends React.Component<any> {
  public terminalEl: any = null;

  public componentDidMount() {
    if (this.terminalEl) {
      this.props.init(this.terminalEl);
    }
  }

  public render() {
    return (
      <div className="app-logger">
        <div className="app-terminal">
          <div
            className="terminal"
            ref={node => {
              this.terminalEl = node;
            }}
          />
        </div>
      </div>
    );
  }
}

export default LoggerView;
