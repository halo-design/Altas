// import classNames from 'classnames';
import * as React from 'react';
import RootPortal from '../RootPortal';
import './index.scss'

interface ILogoProp {
  title: string;
  hide: boolean;
  mask: boolean;
}

export default ({ title, hide, mask }: ILogoProp): any => {
  return (
    <RootPortal>
      {
        hide
        ? ''
        : (
          <div className="line-progress">
            {
              mask
              ? (
                <div className="line-progress-mask" />
              )
              : ''
            }
            <div className="line-progress-content">
              <div className="line-progress-title">{title || '正在加载中'}</div>
              <div className="line-progress-track">
                <div className="line-progress-bar type1" />
                <div className="line-progress-bar type2" />
              </div>
            </div>
          </div>
        )
      }
    </RootPortal>
  )
}
