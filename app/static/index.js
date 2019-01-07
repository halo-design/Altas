process.env.HMR_PORT=62365;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../layouts/Sidebar.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var Sidebar = function Sidebar() {
  return React.createElement("footer", null, React.createElement(_reactRouterDom.NavLink, {
    exact: true,
    to: "/home"
  }, "home"), React.createElement(_reactRouterDom.NavLink, {
    exact: true,
    to: "/mine"
  }, "mine"), React.createElement(_reactRouterDom.NavLink, {
    exact: true,
    to: "/sync"
  }, "sync"));
};

var _default = Sidebar;
exports.default = _default;
},{}],"../views/Home.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HomeView =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HomeView, _React$Component);

  function HomeView() {
    _classCallCheck(this, HomeView);

    return _possibleConstructorReturn(this, _getPrototypeOf(HomeView).apply(this, arguments));
  }

  _createClass(HomeView, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "App"
      }, React.createElement("div", {
        className: "logo"
      }), React.createElement("h1", null, "Awesome Nail!"));
    }
  }]);

  return HomeView;
}(React.Component);

var _default = HomeView;
exports.default = _default;
},{}],"../utils/bridge.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectFile = exports.messageBox = exports.download = exports.clipboard = exports.default = void 0;

var _electron = require("electron");

var dialog = _electron.remote.dialog;
var _default = {
  test: function test() {
    _electron.ipcRenderer.send('ipc-start');
  },
  detect: function detect(cb) {
    _electron.ipcRenderer.once('ipc-running', function (event, arg) {
      cb(arg);
    });
  }
};
exports.default = _default;
var clipboard = {
  trigger: function trigger() {
    _electron.ipcRenderer.send('read-clipboard');
  },
  bind: function bind(cb) {
    _electron.ipcRenderer.on('get-clipboard-text', function (event, arg) {
      cb(arg);
    });
  },
  unbind: function unbind() {
    _electron.ipcRenderer.removeAllListeners('get-clipboard-text');
  }
};
exports.clipboard = clipboard;
var download = {
  trigger: function trigger(filePath) {
    _electron.ipcRenderer.send('file-download', filePath);
  },
  bind: function bind(cb) {
    _electron.ipcRenderer.on('on-download-state', function (event, arg) {
      cb(arg);
    });
  },
  unbind: function unbind() {
    _electron.ipcRenderer.removeAllListeners('on-download-state');
  }
};
exports.download = download;

var messageBox = function messageBox(args) {
  _electron.ipcRenderer.send('on-dialog-message', Object.assign({
    type: 'info'
  }, args));
}; // https://electronjs.org/docs/api/dialog


exports.messageBox = messageBox;

var selectFile = function selectFile(args, cb) {
  dialog.showOpenDialog(Object.assign({
    defaultPath: '../Desktop'
  }, args), cb);
};

exports.selectFile = selectFile;
},{}],"../views/Mine.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _bridge = _interopRequireWildcard(require("../utils/bridge"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MineView =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MineView, _React$Component);

  function MineView(props) {
    var _this;

    _classCallCheck(this, MineView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MineView).call(this, props));

    _this.testPath = function (path) {
      var urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ig;
      return urlReg.test(path);
    };

    _this.clearPath = function () {
      _this.setState({
        filePath: ''
      });
    };

    _this.setPath = function (path) {
      _this.setState({
        filePath: path.trim()
      });
    };

    _this.download = function () {
      var filePath = _this.state.filePath;

      if (_this.testPath(filePath)) {
        console.log(filePath);

        _bridge.download.trigger(filePath);
      } else {
        _this.clearPath();
      }
    };

    _this.handleChange = function (event) {
      _this.setPath(event.target.value);
    };

    _this.handlePaste = function (event) {
      event.preventDefault();

      _bridge.clipboard.trigger();
    };

    _this.state = {
      filePath: ''
    };
    return _this;
  }

  _createClass(MineView, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      _bridge.default.test();

      _bridge.default.detect(function (arg) {
        var appName = arg.appName,
            version = arg.version;
        console.log("".concat(appName, " ").concat(version, "\u5DF2\u7ECF\u542F\u52A8\uFF01"));
      });

      _bridge.clipboard.bind(function (arg) {
        _this2.setPath(arg);
      });

      _bridge.download.bind(function (arg) {
        console.log(arg);

        if (arg.status === 'completed') {
          _this2.clearPath();
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    // public componentDidMount () {
    //   selectFile({
    //     properties: ['openDirectory']
    //   }, args => {
    //     console.log(args);
    //   })
    // };
    value: function componentWillUnmount() {
      _bridge.download.unbind();

      _bridge.clipboard.unbind();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "page-mine"
      }, React.createElement("input", {
        type: "text",
        name: "remotePath",
        onPaste: this.handlePaste,
        onChange: this.handleChange,
        value: this.state.filePath
      }), React.createElement("button", {
        onClick: this.download
      }, "\u70B9\u51FB\u4E0B\u8F7D\u6587\u4EF6"), React.createElement("button", {
        onClick: this.handlePaste
      }, "\u7C98\u8D34\u526A\u5207\u677F\u94FE\u63A5"));
    }
  }]);

  return MineView;
}(React.Component);

var _default = MineView;
exports.default = _default;
},{"../utils/bridge":"../utils/bridge.ts"}],"../views/Sync.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Menu = _electron.remote.Menu,
    MenuItem = _electron.remote.MenuItem,
    getCurrentWindow = _electron.remote.getCurrentWindow;

var SyncView =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SyncView, _React$Component);

  function SyncView() {
    _classCallCheck(this, SyncView);

    return _possibleConstructorReturn(this, _getPrototypeOf(SyncView).apply(this, arguments));
  }

  _createClass(SyncView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // 右键菜单
      var menu = new Menu();
      menu.append(new MenuItem({
        label: 'MenuItem1',
        click: function click() {
          console.log('item 1 clicked');
        }
      }));
      menu.append(new MenuItem({
        type: 'separator'
      }));
      menu.append(new MenuItem({
        label: 'MenuItem2',
        type: 'checkbox',
        checked: true
      }));
      window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        menu.popup(getCurrentWindow());
      }, false);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", null, "sync");
    }
  }]);

  return SyncView;
}(React.Component);

var _default = SyncView;
exports.default = _default;
},{}],"App.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _Sidebar = _interopRequireDefault(require("../layouts/Sidebar"));

var _Home = _interopRequireDefault(require("../views/Home"));

var _Mine = _interopRequireDefault(require("../views/Mine"));

var _Sync = _interopRequireDefault(require("../views/Sync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// const Sync = React.lazy(() => import('../views/Sync'));
var App = function App() {
  return React.createElement("div", {
    className: "app-core"
  }, React.createElement(_reactRouterDom.Switch, null, React.createElement(_reactRouterDom.Route, {
    path: "/home",
    component: _Home.default
  }), React.createElement(_reactRouterDom.Route, {
    path: "/mine",
    component: _Mine.default
  }), React.createElement(_reactRouterDom.Route, {
    path: "/sync",
    component: _Sync.default
  }), React.createElement(_reactRouterDom.Route, {
    component: function component() {
      return React.createElement(_reactRouterDom.Redirect, {
        to: "/home"
      });
    }
  })), React.createElement(_Sidebar.default, null));
};

var _default = App;
exports.default = _default;
},{"../layouts/Sidebar":"../layouts/Sidebar.tsx","../views/Home":"../views/Home.tsx","../views/Mine":"../views/Mine.tsx","../views/Sync":"../views/Sync.tsx"}],"../../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error;
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;

},{}],"../../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;

},{"./bundle-url":"../../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../assets/style/app.scss":[function(require,module,exports) {
"use strict";

var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../font/halo.ttf":[["halo.d81157db.ttf","../assets/font/halo.ttf"],"../assets/font/halo.ttf"],"./../img/logo.png":[["logo.bc646dd2.png","../assets/img/logo.png"],"../assets/img/logo.png"],"_css_loader":"../../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.tsx":[function(require,module,exports) {
"use strict";

var React = _interopRequireWildcard(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _reactRouterDom = require("react-router-dom");

var _App = _interopRequireDefault(require("./App"));

require("../assets/style/app.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

ReactDOM.render(React.createElement(_reactRouterDom.HashRouter, {
  basename: "/"
}, React.createElement(_App.default, null)), document.getElementById("MOUNT_NODE"));
},{"./App":"App.tsx","../assets/style/app.scss":"../assets/style/app.scss"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = process.env.HMR_HOSTNAME || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + process.env.HMR_PORT + '/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = (
    '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
      '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
      '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
      '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' +
      '<pre>' + stackTrace.innerHTML + '</pre>' +
    '</div>'
  );

  return overlay;

}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id)
  });
}

},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.tsx"], null)
//# sourceMappingURL=/index.map