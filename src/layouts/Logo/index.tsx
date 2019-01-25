import classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './index.scss'

export default ({ size, style, run }: { size: number, style: object, run: boolean }): any => {
  const allStyle = {
    backgroundSize: `${size}px ${size}px`,
    height: `${size}px`,
    width: `${size}px`,
    ...style
  }
  return (
    <Link
      to='/home'
      className={classNames({
        'app-logo': true,
        'running': run
      })}
      style={allStyle}
    />
  )
}
