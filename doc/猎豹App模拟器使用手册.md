# 猎豹移动App调试器使用手册

## （一）什么是猎豹调试器

> 猎豹移动App调试器是专为猎豹移动设计的配套开发调试工具，旨在解决开发过程中的应用调试问题及真机环境模拟，极大的提升开发效率以及开发便利性。

### 猎豹调试器界面一览

1. 主应用入口首页——猎豹移动App调试器是猎豹开发平台主应用下的子应用。可在左侧侧边栏按钮下方的选项入口直接打开猎豹调试器及mock模拟工具。除此之外，还可以通过主菜单的开发者工具选项卡界面中直接打开。

![image](https://i.loli.net/2019/08/08/P3g1LWmo78OTtHw.png)

2. 猎豹App调试器/mock模拟工具主界面

![image](https://i.loli.net/2019/08/08/gLU1MaAV3skmXot.png)

## （二）猎豹App调试器功能

### 1. 本地Mock调试

> 调试器内置了大部分与客户端App同步的方法，比如路由管理、交互管理。在一些不涉及到客户端Native方法或者第三方API接口调用的场景下，可以基本满足开发要求。然而 在实际业务开发中，不可避免地会需要调用到客户端Native或者第三方API。针对这个问题，调试器内置了一套静态数据对客户端方法进行Mock处理。

当页面发起JSAPI调用时，调试器会将读取到的本地静态数据返回给调用端，保证开发过程业务流程可以完整运行。当然这些参数并不是固定的，用户可以自由编辑参数内容，点击保存即可生效。

![image](https://i.loli.net/2019/08/08/ZqG3KT6pRrbiYzX.png)

用户也可以自由添加或者删除Mock条目，当内置的Mock数据无法满足开发需求时，点击增加配置项即可轻易地增加新的Mock数据条目。如果想要移除，右键删除即可完成。（**注意** ：在输入添加内容后，需要点击保存配置方能生效。）

![image](https://i.loli.net/2019/08/08/XP9u8QUEGIHJSCe.png)

### 2. 自动缓存应用调试数据

除了特定情况或场景下，我们建议打开自动缓存应用调试的功能，自动缓存应用调试数据可以获取接管模式下（下文会有介绍）所捕获的所有从客户端App返回的参数并实时保存在本地。在静态数据Mock模式下，则可以读取最近缓存的数据，相比手动添加或修改数据，显然该模式效率更高。如果需要重置全部Mock数据到出厂模式，可以点击左下角重置按钮进行重置。

**特别注意：** 该模式是覆盖式写入, 如果不希望手动添加的数据被覆盖，请关闭自动缓存。 

### 3. 调试器Developer Tools

> 调试器的容器是基于Chromium核心开发的，所以你可以获得与chrome浏览器Developer Tools工具同等的开发体验，操作方式与Chrome Developer Tools基本一致。这是真机调试无法做到的。

调试器为了还原客户端真实的运行场景，也同步实现了多webview容器，每个页面都对应独立的Developer Tools，所以在调试过程中，页面被关闭或者被推向后台，都会自动关闭对应的Developer Tools面板。

![image](https://i.loli.net/2019/08/08/UcKx1tA8CQn75EM.png)

![image](https://i.loli.net/2019/08/08/B6eYg13fGmFtcUK.png)

### 4. 调试器接管模式

> 什么是接管模式？通常情况下，我们可以脱离真机设备直接在调试器中进行项目开发，但是仍有一些情况下，我们需要部分调用客户端原生的API来获取数据。比如出现调试器无法Mock的数据，模拟器缺少对应的API功能，客户端测试新增的API接口...
所以针对这些问题，我们设计了接管模式——在调试器内调用的JSAPI将会被客户端App接管，并实时返回真机操作数据。

**连接服务：** 
点击接管程序控制台面板右下角“启动接管模式”按钮开启本地接管服务，屏幕将生成动态链接二维码，在装有猎豹App的移动设备上点击扫一扫功能扫描二维码即可进入接管页面。该页面中可实时看到连接状态，控制台面板也可以清晰看到接管服务当前的运行状态。（注意：只有客户端和本地接管服务连接正常时接管模式才能生效。）

![image](https://i.loli.net/2019/08/08/MsJbLvacwpkT2oX.png)

**操作说明：**
在接管模式中，你可以看到模拟器内调用的方法在移动设备上触发，部分调用可能需要用户在真机上进行交互操作，所以我们建议在进行项目调试的时候将设备设置为常亮模式。

![image](https://i.loli.net/2019/08/08/2xc9BXe7UiGNCb4.png)

**调用参数监听：**
接管程序控制台内置了日志监听组件，所有通过接管程序和代理服务的数据都会被实时打印出来，监听组件主要监听代理服务的启动状态、接管程序连接状态以及调用产生的日志，具体的日志信息由调用JSAPI方法名、调用参数、返回参数三部分组成。

![image](https://i.loli.net/2019/08/08/blPUVJGOd6E75aN.png)

**直接调用JSAPI：** 在接管模式下，我们不仅可以在页面内部对API进行调用，在调试Developer Tools的console选项卡面板，我们可以直接输入API调用代码，如下图所示：

![image](https://i.loli.net/2019/08/08/RVQ2LpiIoel6T9h.png)

**全局接管模式设置：**
在某些特定的场景，我们可能需要将所有的JSAPI调用都由客户端接管，比如JSAPI测试、参数验证等。
我们可以在控制台或者页面内调用该方法进行开启：
```javascript
AlipayJSBridge.setRemoteMode(true);
```

**接管模式说明：**
默认情况下开启的接管模式，并不会接管全部的JSAPI调用，仅仅只针对部分模拟器无法模拟的部分JSAPI接口有效，如第三方键盘、Native方法。具体情况可参照下一章节。


## （三）猎豹App调试器JSAPI模拟情况一览

> 说明：表格中空方法通常是对移动设备系统进行的修改或设置操作，无数据返回，模拟器仅接受回调，并不进行任何实际操作，故通常设置为空方法。对于需要返回设备硬件或系统信息，通常以本地mock数据的方式进行配置，以下皆遵循此规则。

**交互管理**

名称 | 方法名 | 模拟情况 | 测试情况
---|---|---|---
警告框 | alertEx | ✅ 已模拟 | ️✅ 测试通过
输入提示框 | howInputAlert | ✅ 已模拟 | ️️✅ 测试通过
显示加载中 | showLoadingEx | ✅ 已模拟 | ️✅ 测试通过
隐藏加载中 | hideLoadingEx | ✅ 已模拟 | ️✅ 测试通过
时间日期选择器 | showDatePicker | ✅ 已模拟 | ✅ 测试通过
数据选择器 | howPickerView | ✅ 已模拟 | ️✅ 测试通过
导航栏遮罩 | showMask | ✅ 已模拟 | ✅ 测试通过
隐藏导航栏遮罩 | hideMask | ✅ 已模拟 | ✅ 测试通过
设置导航栏左侧按钮 | setLeftMenu | ✅ 已模拟 |✅ 测试通过
显示导航栏左侧按钮 | showLeftMenu | ✅ 已模拟 | ✅ 测试通过
设置导航栏标题/图片 | setMiddleTitle | ✅ 已模拟 | ✅ 测试通过
设置导航栏右侧按钮 | setRightMenu | ✅ 已模拟 | ✅ 测试通过
设置导航栏底部分隔线颜色 | setBarBottomLineColorEx | ✅ 已模拟 |  ✅ 测试通过
显示导航栏 | showTitleBar | ✅ 已模拟 | ✅ 测试通过
隐藏导航栏 | hideTitleBar | ✅ 已模拟 | ✅ 测试通过
设置导航栏背景色 | setTitleBarColor | ✅ 已模拟 | ✅ 测试通过
获取状态栏高度 | getStatusBarHeight | ✅ 本地mock | ✅ 测试通过
获取导航栏高度 | getTitleBarHeight | ✅ 本地mock | ✅ 测试通过
设置状态栏风格 | setStatusBarStyle | ⭕️ 空方法/可接管 | -
开始下拉刷新 | startPullDownRefresh | ✅ 已模拟 | ✅ 测试通过
结束下拉刷新 | stopPullDownRefresh | ✅ 已模拟 | ✅ 测试通过
显示弱提示 | showToast | ✅ 已模拟 | ✅ 测试通过
显示选项卡 | showActionSheet | ✅ 已模拟 | ✅ 测试通过

**用户信息管理**

名称 | 方法名 | 模拟情况 | 测试情况
---|---|---|---
更新用户信息 | updateUserInfo | ✅本地Mock/可接管 | ✅ 测试通过
清除用户信息 | cleanUserInfo | ⚠️待模拟/可接管 | -
获取用户信息 | getUserInfo |  ✅本地Mock/可接管 | ✅ 测试通过
登录 | login |  ⚠️待模拟/可接管 | -
获取用户sessionID | getSessionID |  ⭕️ 空方法/可接管 | -
设置用户sessionID | setSessionID |  ⭕️ 空方法/可接管 | -

**第三方能力**

名称 | 方法名 | 模拟情况 | 测试情况
---|---|---|---
打开人脸识别 | openFaceRecognition | ✅可接管 | ✅ 测试通过
打开二维码扫描 | openQRCodeScanner | ✅本地Mock/可接管 | ✅ 测试通过
打开分享面板 | showSharePad | ⭕️ 空方法/可接管 | -
直接分享 | shareTo | ⭕️ 空方法/可接管 | -
显示安全键盘 | showKeyboard | ✅本地Mock/可接管 | ✅ 测试通过
关闭安全键盘 | hideKeyboard | ✅本地Mock/可接管 | ✅ 测试通过
显示支付密码键盘 | showPaymentPad | ✅本地Mock/可接管 | ✅ 测试通过
打开身份证OCR | showOCRIDCard | ✅本地Mock/可接管 | ✅ 测试通过
打开银行卡OCR | showOCRBankCard | ✅本地Mock/可接管 | ✅ 测试通过
检查版本更新 | checkAppUpdate | ✅本地Mock/可接管 | ✅ 测试通过

**Native功能**

名称 | 方法名 | 模拟情况 | 测试情况
---|---|---|---
设置调试模式useragent | debugMode | 🛑 不需要模拟 | -
打开通讯录列表 | showContactList | ✅本地Mock/可接管 | ✅ 测试通过
截屏 | screenShots | ✅本地Mock/可接管 | ✅ 测试通过
设置剪贴板 | copyToClipboard | ✅ 已模拟 | ️✅ 测试通过
发送短信 | sendSMS | ✅可接管 | -
发送邮件 | sendMail | ✅可接管 | -
打开相册/拍照界面 | showCameraImagePicker | ✅本地Mock/可接管 | ✅ 测试通过
获取定位信息 | getLocationInfo |✅本地Mock/可接管 | ✅ 测试通过
http请求-安卓小程序 | httpRequest | 🛑 不需要模拟 | -
设置屏幕亮度 | setBrightness | ✅可接管 | -
恢复屏幕亮度 | recoverBrightness | ✅可接管 | -
下载PDF | downloadPdf | ✅可接管 | -
中文转大写拼音 | chinese2MandarinLatin | ✅ 已模拟 | ️✅ 测试通过
打开第三方APP | startOtherApp | ✅可接管 | -
检测ApplePay-iOS | availableApplePay | ✅可接管 | -
检测推送通知权限 | notificationStatus | ✅可接管 | -
检测定位权限 | availableLocationServices | ✅可接管 | -
打开定位设置 | openLocationSettings | ✅可接管 | -
打开浏览器 | openNativeWebBrowser | ✅ 已模拟 | ️✅ 测试通过
增加日历提醒 | addCalendarReminder | ✅可接管 | -
拨打电话 | callPhoneNumber | ✅可接管 | -
检测是否已安装APP | isInstallApp | ✅可接管 | -
检测GPS是否可用 | availableGPS | ✅可接管 | -
开始本地指纹/面容识别 | startLocalAuthentication | ✅可接管 | -
检测本地指纹/面容识别是否可用 | availableLocalAuthentication | ✅可接管 | -
设置本地指纹/面容识别开启 | setLocalAuthenticationOnOff | ✅可接管 | -
清除本地指纹/面容识别开启 | clearLocalAuthenticationOnOff | ✅可接管 | -
获取本地指纹/面容识别开启 | getLocalAuthenticationOnOff | ✅可接管 | -
设置指纹/面容识别token | setFingerPrintToken |✅可接管 | -
设置手势开启 | getGestureOnOff | ✅可接管 | -
获取手势路径是否显示 | getGesturePathShowState | ✅可接管 | -
设置手势路径是否显示 | setGesturePathShowState | ✅可接管 | -
打开手势设置 | pushGestureSetting | ✅可接管 | -
设置手势token | setGestureToken |✅可接管 | -

**路由管理**

名称 | 方法名 | 模拟情况 | 测试情况
---|---|---|---
关闭页面 | closePage | ✅ 已模拟 | ⚠️待测试
关闭到指定页面 | closeToPage | ✅ 已模拟 | ⚠️待测试
关闭所有页面回到首页 | closeToHomePage | ✅ 已模拟 | ⚠️待测试
打开容器 | pushWindow | ✅ 已模拟 | ⚠️待测试
打开离线包 | startH5App | ✅ 已模拟 | ⚠️待测试
清除webview历史 | clearHistory | ✅ 已模拟 | ⚠️待测试

**存储管理**
名称 | 方法名 | 模拟情况 | 测试情况
---|---|---|---
设置磁盘缓存 | setStorageCache | ✅ 已模拟 | ️✅ 测试通过
获取磁盘缓存 | getStorageCache | ✅ 已模拟 | ️✅ 测试通过
设置内存缓存 | setMemoryCache | ✅ 已模拟 | ️✅ 测试通过
获取内存缓存 | getMemoryCache | ✅ 已模拟 | ️✅ 测试通过

**业务功能**
名称 | 方法名 | 模拟情况 | 测试情况
---|---|---|---
打开银行列表 | openBankList | ✅本地Mock/可接管 | ✅ 测试通过
打开城市列表 | pushCityListView | ✅可接管 | -
获取APP内所有版本信息 | getVersionInfo | ✅本地Mock/可接管 | ✅ 测试通过
获取服务端时间 | getServerDate | ✅本地Mock/可接管 | ✅ 测试通过
获取当前首页风格 | getCurrentStyle | ✅本地Mock/可接管 | ✅ 测试通过
获取图片服务器地址 | getServerUrl | ✅本地Mock/可接管 | ✅ 测试通过
埋点事件 | trackEvent | ✅可接管 | -
打开第三方地图导航APP | openNavigationApp |  ✅可接管 | -
打开银行网点 | pushBankbranchView |  ✅可接管 | -