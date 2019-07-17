import * as React from 'react';
import classNames from 'classnames';
import { DeviceContext } from '../context';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import DatePicker from 'antd-mobile/lib/date-picker';
import Picker from 'antd-mobile/lib/picker';
import Icon from 'antd-mobile/lib/icon';
import menuIcons from '../utils/icons';

@inject((stores: any) => {
  const {
    webviewList,
    focusIndex,
    webviewCount,
    behavior,
    datepickerParams,
    pickerParams,
    triggleRefresh,
    leftMenus,
    leftMenusVisible,
    rightMenus,
    rightMenusVisible,
    middleTitle,
    navBarBottomLineColor,
    navBarVisible,
    navBarMaskVisible,
    navBarMaskBgColor,
    navBarBgColor,
    offsetTop,
  } = stores.webview;

  return {
    webviewList,
    focusIndex,
    webviewCount,
    behavior,
    datepickerParams,
    pickerParams,
    triggleRefresh,
    leftMenus,
    leftMenusVisible,
    rightMenus,
    rightMenusVisible,
    middleTitle,
    navBarBottomLineColor,
    navBarVisible,
    navBarMaskVisible,
    navBarMaskBgColor,
    navBarBgColor,
    offsetTop,
    createNewWebview: (url: string, params: object) =>
      stores.webview.createNewWebview(url, params),
    getWebviewDOM: (index: number, el: any, uid: string) =>
      stores.webview.getWebviewDOM(index, el, uid),
    initDatePicker: (el: any) => stores.webview.initDatePicker(el),
    initPicker: (el: any) => stores.webview.initPicker(el),
    focusToPrevWebview: () => stores.webview.focusToPrevWebview(),
    focusWebviewSender: (name: string, params: object) =>
      stores.webview.focusWebviewSender(name, params),
  };
})
@observer
class WebviewView extends React.Component<any, any> {
  static contextType = DeviceContext;
  public webview: any = null;
  public datepickerEl: any = null;
  public pickerEl: any = null;

  public navMenuHandle(
    icon: string,
    override: boolean,
    index: number,
    uid: string
  ) {
    if (icon === 'back' && !override) {
      this.props.focusToPrevWebview();
    } else {
      this.props.focusWebviewSender(uid, { index });
    }
  }

  public componentDidMount() {
    const { target } = this.context;
    this.props.createNewWebview(target);
    this.props.initDatePicker(this.datepickerEl);
    this.props.initPicker(this.pickerEl);
    // setTimeout(() => {
    //   this.props.createNewWebview('http://i.jandan.net/qa');
    // }, 1000);
    // setTimeout(() => {
    //   this.props.createNewWebview('/treehole');
    // }, 2000);
    // setTimeout(() => {
    //   this.props.createNewWebview('/ooxx');
    // }, 3000);
    // setTimeout(() => {
    //   this.props.createNewWebview('/zoo');
    // }, 4000);
  }

  public render() {
    const {
      descriptors: {
        viewport: { width, height },
      },
    } = this.context;

    const {
      webviewCount,
      webviewList,
      getWebviewDOM,
      focusIndex,
      behavior,
      datepickerParams,
      pickerParams,
      triggleRefresh,
      leftMenus,
      leftMenusVisible,
      rightMenus,
      rightMenusVisible,
      middleTitle,
      navBarBottomLineColor,
      navBarVisible,
      navBarMaskVisible,
      navBarMaskBgColor,
      navBarBgColor,
      offsetTop,
    } = this.props;

    const wvSize = {
      width: width + 'px',
      height: height - offsetTop + 'px',
      top: offsetTop + 'px',
    };

    let trans: any = {
      width: `${webviewCount * 100}vw`,
      transform: `translateX(-${focusIndex * 100}vw)`,
    };

    if (webviewCount <= 1 || /replace|clear/.test(behavior)) {
      trans.transitionProperty = 'none';
    }

    const setMenus = (menuArr: any): React.ReactNode => {
      if (Array.isArray(menuArr)) {
        return menuArr.map((menu: any, index: number) => {
          const { icontype, icon, text, color, overrideClick, uid } = menu;
          const ico = icontype || icon;
          return (
            <div
              className="cell"
              key={index}
              onClick={() => {
                this.navMenuHandle(ico, overrideClick, index, uid);
              }}
            >
              {ico && (
                <div className="icon">
                  <img src={menuIcons(ico)} alt="icon" />
                </div>
              )}
              {text && (
                <span className="txt" style={{ color }}>
                  {text}
                </span>
              )}
            </div>
          );
        });
      } else {
        return '';
      }
    };

    const setTitle = (params: any): React.ReactNode => {
      const { title, color, img } = params;
      return (
        <div className="cell">
          {img && (
            <div className="icon">
              <img src={menuIcons(img)} alt="icon" />
            </div>
          )}
          {title && (
            <span className="txt" style={{ color }}>
              {title}
            </span>
          )}
        </div>
      );
    };

    return (
      <div className="app-webview-container">
        {triggleRefresh && (
          <div className="load-status-bar">
            <Icon type="loading" />
            <span className="label">正在刷新</span>
          </div>
        )}
        {navBarVisible && (
          <div
            className="cheetah-header"
            style={{
              backgroundColor: navBarBgColor,
              borderBottom: navBarBottomLineColor
                ? `1px solid ${navBarBottomLineColor}`
                : 'none',
            }}
          >
            {leftMenusVisible && (
              <div className="left-menus">{setMenus(leftMenus)}</div>
            )}
            <div className="middle-title">{setTitle(middleTitle)}</div>
            {rightMenusVisible && (
              <div className="right-menus">{setMenus(rightMenus)}</div>
            )}
            {navBarMaskVisible && (
              <div
                className="mask"
                style={{
                  backgroundColor: navBarMaskBgColor,
                }}
              />
            )}
          </div>
        )}
        <div
          className={classNames('app-webview', { loading: triggleRefresh })}
          style={wvSize}
        >
          <div className="app-webview-wrapper" style={trans}>
            {webviewList.map((item: any, index: number) => {
              return (
                <webview
                  {...toJS(item.attr)}
                  key={item.uid}
                  ref={node => {
                    getWebviewDOM(index, node, item.uid);
                  }}
                />
              );
            })}
          </div>
          <div className="hidden-element">
            <DatePicker {...datepickerParams}>
              <span
                ref={node => {
                  this.datepickerEl = node;
                }}
              >
                datepicker
              </span>
            </DatePicker>
            <Picker {...pickerParams}>
              <span
                ref={node => {
                  this.pickerEl = node;
                }}
              >
                picker
              </span>
            </Picker>
          </div>
        </div>
      </div>
    );
  }
}

export default WebviewView;
