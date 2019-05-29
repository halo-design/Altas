import { inject, observer } from 'mobx-react';
import * as React from 'react';
import './index.scss';

interface IProps {
  init: (el: HTMLElement) => void;
  destroy: () => void;
}

@inject((stores: any) => {
  return {
    init: (el: HTMLElement) => stores.terminal.init(el),
    destroy: () => stores.terminal.destroy(),
  };
})
@observer
class TerminalView extends React.Component<IProps> {
  public terminalEl: any = null;

  public componentDidMount() {
    if (this.terminalEl) {
      this.props.init(this.terminalEl);
    }
  }

  public componentWillUnmount() {
    this.props.destroy();
  }

  public render() {
    return (
      <div className="app-terminal">
        <div
          className="terminal"
          ref={node => {
            this.terminalEl = node;
          }}
        />
      </div>
    );
  }
}

export default TerminalView;
