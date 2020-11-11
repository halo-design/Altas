import * as React from 'react';
import classNames from 'classnames';
import { DeviceContext } from '../context';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import DatePicker from 'antd-mobile/lib/date-picker';
import Picker from 'antd-mobile/lib/picker';
import Icon from 'antd-mobile/lib/icon';
import menuIcons from '../utils/icons';
import argb2rgba from '../utils/argb2rgba';

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
    curTime,
    focusOnFisrt,
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
    curTime,
    focusOnFisrt,
    createNewWebview: (url: string, params: any) =>
      stores.webview.createNewWebview(url, params),
    getWebviewDOM: (index: number, el: any) =>
      stores.webview.getWebviewDOM(index, el),
    getIndexWebviewDOM: (el: any) => stores.webview.getIndexWebviewDOM(el),
    initDatePicker: (el: any) => stores.webview.initDatePicker(el),
    initPicker: (el: any) => stores.webview.initPicker(el),
    focusToPrevWebview: () => stores.webview.focusToPrevWebview(),
    focusWebviewSender: (name: string, params: any) =>
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
    if (typeof icon === 'string' && icon.indexOf('back_') === 0 && !override) {
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
  }

  public render() {
    const {
      preload,
      descriptors: {
        userAgent,
        viewport: { width, height },
      },
    } = this.context;

    const {
      webviewCount,
      webviewList,
      getWebviewDOM,
      getIndexWebviewDOM,
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
      curTime,
      focusOnFisrt,
    } = this.props;

    const wvSize = {
      width: width + 'px',
      height: height - offsetTop - 40 + 'px',
      top: offsetTop + 'px',
    };

    const trans: any = {
      width: `${(webviewCount + 1) * 100}vw`,
      height: wvSize.height,
      transform: `translateX(-${(webviewCount === 0 ? 0 : focusIndex + 1) *
        100}vw)`,
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
              className={classNames('cell', {
                disabled:
                  focusOnFisrt &&
                  typeof ico === 'string' &&
                  ico.indexOf('back_') === 0 &&
                  !overrideClick,
              })}
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
                <span className="txt" style={{ color: argb2rgba(color) }}>
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
            <span className="txt" style={{ color: argb2rgba(color) }}>
              {title}
            </span>
          )}
        </div>
      );
    };

    return (
      <div className="app-webview-container">
        <div className="state-bar">
          <div className="wifi" />
          <div className="time-center">{curTime}</div>
          <div className="battery" />
        </div>
        {navBarVisible && webviewCount > 0 && (
          <div
            className="cheetah-header"
            style={{
              backgroundColor: argb2rgba(navBarBgColor),
              borderBottom: navBarBottomLineColor
                ? `0.5px solid ${argb2rgba(navBarBottomLineColor)}`
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
        {triggleRefresh && (
          <div className="load-status-bar">
            <Icon type="loading" />
            <span className="label">正在刷新</span>
          </div>
        )}
        <div
          className={classNames('app-webview', { loading: triggleRefresh })}
          style={wvSize}
        >
          <div className="app-webview-wrapper" style={trans}>
            <webview
              preload={preload}
              useragent={userAgent}
              style={wvSize}
              src="../public/html/simulator-index.html"
              ref={node => {
                getIndexWebviewDOM(node);
              }}
            />
            {webviewList.map((item: any, index: number) => {
              return (
                <webview
                  {...toJS(item.attr)}
                  key={item.uid}
                  ref={node => {
                    getWebviewDOM(index, node);
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
