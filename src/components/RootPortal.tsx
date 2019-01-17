import * as React from 'react';
import { createPortal } from 'react-dom';

export default class RootPortal extends React.Component<any> {
  public node: HTMLElement = document.createElement('div');

  public componentWillMount () {
    document.body.appendChild(this.node)
  }

  public componentWillUnmount () {
    document.body.removeChild(this.node)
  }

  public render () {
    return createPortal(
      this.props.children,
      this.node
    )
  }
}
