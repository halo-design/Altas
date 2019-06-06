import classNames from 'classnames';
import * as React from 'react';
import './index.scss';

interface ILogoProp {
  title: string;
  hide: boolean;
  mask: boolean;
}

class LineProgresslView extends React.Component<ILogoProp> {
  render() {
    const { title, hide, mask } = this.props;
    return (
      <div
        className={classNames('line-progress', {
          hide,
        })}
      >
        {mask ? <div className="line-progress-mask" /> : ''}
        <div className="line-progress-content">
          <div className="line-progress-title">{title || '正在加载中'}</div>
          <div className="line-progress-track">
            <div className="line-progress-bar type1" />
            <div className="line-progress-bar type2" />
          </div>
        </div>
      </div>
    );
  }
}

export default LineProgresslView;
