import * as React from 'react';
import { createPortal } from 'react-dom';
const { useEffect } = React;

export interface IRootPortalProps {
  children: any;
}

function RootPortal({ children }: IRootPortalProps) {
  const node: HTMLElement =
    document.getElementById('ROOT_PORTAL_CONTAINER') ||
    document.createElement('div');

  if (!node.id) {
    node.id = 'ROOT_PORTAL_CONTAINER';
  }

  useEffect(() => {
    document.body.appendChild(node);

    return () => {
      document.body.removeChild(node);
    };
  });

  return createPortal(children, node);
}

export default RootPortal;
