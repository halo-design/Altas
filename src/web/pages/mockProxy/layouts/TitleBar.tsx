import classNames from 'classnames';
import * as React from 'react';
import win from '../../../main/bridge/win';
import { disposeMockProxyServer } from '../../../main/bridge/mockProxyServer';

const { useState } = React;

function TitleBar() {
  const [isMax, setMax]: [boolean, any] = useState(false);

  const maxToogle = () => {
    if (win.isMax()) {
      win.unmaximize();
      setMax(false);
    } else {
      win.maximize();
      setMax(true);
    }
  };

  const closePage = () => {
    disposeMockProxyServer();
    win.close();
  };

  return (
    <div className="control">
      <div className="tit">猎豹App模拟器数据设置</div>
      <div className="file-name" />
      <div className="win">
        <button className="min" onClick={win.minimize} />
        <button
          className={classNames('toogle', { back: isMax })}
          onClick={maxToogle}
        />
        <button className="close" onClick={closePage} />
      </div>
    </div>
  );
}

export default TitleBar;
