import classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './index.scss'

export default ({ size, style, run, initPath }: { size: number, style: object, run: boolean, initPath: string }): any => {
  const allStyle = {
    backgroundSize: `${size}px ${size}px`,
    height: `${size}px`,
    width: `${size}px`,
    ...style
  }
  return (
    <Link
      to={initPath}
      className={classNames({
        'app-logo': true,
        'running': run
      })}
      style={allStyle}
    />
  )
}
