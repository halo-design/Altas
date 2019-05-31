import { inject, observer } from 'mobx-react';
import * as React from 'react';
import './index.scss';

@inject((stores: any) => {
  return {
    initDOM: (el: HTMLElement, images: any[], fn?: Function) =>
      stores.radar.initDOM(el, images, fn),
    start: () => stores.radar.start(),
    dispose: () => stores.radar.dispose(),
  };
})
@observer
class TerminalView extends React.Component<any> {
  public radarEl: any = null;

  public componentDidMount() {
    if (this.radarEl) {
      this.props.initDOM(this.radarEl);
    }
  }

  public componentWillUnmount() {
    this.props.dispose();
  }

  public render() {
    return (
      <div
        className="app-radar"
        ref={node => {
          this.radarEl = node;
        }}
      />
    );
  }
}

export default TerminalView;
