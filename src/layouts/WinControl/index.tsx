import classNames from "classnames";
import * as React from "react";
import win from "../../utils/win";
import "./index.scss";

const { useState } = React;

function WinControl() {
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

  return (
    <div className="app-win-control">
      <button onClick={win.minimize} className="iconfont min" />
      <button
        onClick={maxToogle}
        className={classNames("iconfont", "toogle", { back: isMax })}
      />
      <button onClick={win.close} className="iconfont close" />
    </div>
  );
}

export default WinControl;
