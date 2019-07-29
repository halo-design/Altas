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
      <div className="tit">猎豹App模拟器代理工具</div>
      <div className="file-name tabs">
        <div className="item active">App接管模式</div>
        <div className="item">本地mock模式</div>
      </div>
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
