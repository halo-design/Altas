import classNames from 'classnames';
import * as React from 'react';
import win from '../../../main/bridge/win';
import { disposeMockProxyServer } from '../../../main/bridge/mockProxyServer';
import { inject, observer } from 'mobx-react';

@inject((stores: any) => {
  const { mockerVisible } = stores.monitor;
  return {
    mockerVisible,
    setMockerVisible: (state: boolean) =>
      stores.monitor.setMockerVisible(state),
  };
})
@observer
class TitleBarView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      isMax: false,
    };
  }

  public maxToogle() {
    if (win.isMax()) {
      win.unmaximize();
      this.setState({
        isMax: false,
      });
    } else {
      win.maximize();
      this.setState({
        isMax: true,
      });
    }
  }

  public closePage() {
    disposeMockProxyServer();
    win.close();
  }

  public render() {
    const { mockerVisible, setMockerVisible } = this.props;
    return (
      <div className="control">
        <div className="tit">猎豹调试器Mock工具</div>
        <div className="file-name tabs">
          <div
            className={classNames('item', { active: !mockerVisible })}
            onClick={() => {
              setMockerVisible(false);
            }}
          >
            接管程序控制台
          </div>
          <div
            className={classNames('item', { active: mockerVisible })}
            onClick={() => {
              setMockerVisible(true);
            }}
          >
            本地Mock数据配置
          </div>
        </div>
        <div className="win">
          <button className="min" onClick={win.minimize} />
          <button
            className={classNames('toogle', { back: this.state.isMax })}
            onClick={() => {
              this.maxToogle();
            }}
          />
          <button
            className="close"
            onClick={() => {
              this.closePage();
            }}
          />
        </div>
      </div>
    );
  }
}

export default TitleBarView;
