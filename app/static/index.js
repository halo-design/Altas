process.env.HMR_PORT=53403;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
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
})({"../utils/ajax.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = exports.upload = void 0;

var getError = function getError(action, xhr) {
  var msg;

  if (xhr.response) {
    msg = "".concat(xhr.response.error || xhr.response);
  } else if (xhr.responseText) {
    msg = "".concat(xhr.responseText);
  } else {
    msg = "fail to post ".concat(action, " ").concat(xhr.status);
  }

  var err = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = action;
  return err;
};

var getBody = function getBody(xhr) {
  var text = xhr.responseText || xhr.response;

  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

var upload = function upload(option) {
  var xhr = new XMLHttpRequest();
  var action = option.action;

  if (xhr.upload) {
    xhr.upload.onprogress = function (e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100;
      }

      if (option.onProgress) {
        option.onProgress(e);
      }
    };
  }

  var formData = new FormData();
  formData.append(option.filename, option.file, option.file.name);

  xhr.onerror = function (e) {
    if (option.onError) {
      option.onError(e);
    }
  };

  xhr.onload = function () {
    if ((xhr.status < 200 || xhr.status >= 300) && option.onError) {
      return option.onError(getError(action, xhr));
    } else if (option.onSuccess) {
      option.onSuccess(getBody(xhr));
      return null;
    }
  };

  xhr.open('post', action, true);

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  var headers = option.headers || {};

  for (var item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }

  xhr.send(formData);
  return xhr;
};

exports.upload = upload;

var getData = function getData(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(getError(url, xhr));
      } else {
        resolve(getBody(xhr));
      }
    };

    xhr.open('get', url, true);
    xhr.send();
  });
};

exports.getData = getData;
},{}],"../models/UploadModel.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var tslib_1 = _interopRequireWildcard(require("tslib"));

var _mobx = require("mobx");

var _ajax = require("../utils/ajax");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UploadModel =
/*#__PURE__*/
function () {
  function UploadModel() {
    var _this = this;

    _classCallCheck(this, UploadModel);

    this.rawFiles = [];
    this.xhrQueue = {};
    this.uploadListStatus = {};
    this.remoteImageArray = [];
    this.uploadAPI = 'https://sm.ms/api/upload?inajax=1&ssl=1';
    this.uploadHistoryAPI = 'https://sm.ms/api/list';
    this.clearuploadHistoryAPI = 'https://sm.ms/api/clear';

    this.getFileList = function (node) {
      if (!_this.isXhrQueueEmpty) {
        return;
      }

      var files = node.files;
      var rawFiles = Array.prototype.slice.call(files);
      console.log(rawFiles);
      _this.rawFiles = rawFiles;
    };

    this.doUpload = function () {
      if (!_this.isXhrQueueEmpty) {
        return;
      }

      _this.postFiles.forEach(function (file, index) {
        var uid = file.uid;
        _this.xhrQueue[uid] = (0, _ajax.upload)({
          action: _this.uploadAPI,
          file: file,
          filename: 'smfile',
          onError: function onError() {
            _this.uploadListStatus[uid].status = 'error';
            delete _this.xhrQueue[uid];
          },
          onProgress: function onProgress(e) {
            _this.uploadListStatus[uid].progress = e;
            _this.uploadListStatus[uid].status = 'pending';
          },
          onSuccess: function onSuccess(e) {
            _this.uploadListStatus[uid].status = 'done';
            _this.uploadListStatus[uid].remote = e.data;

            _this.remoteImageArray.push(e.data);

            delete _this.xhrQueue[uid];

            if (_this.isXhrQueueEmpty) {
              _this.rawFiles = [];
            }
          }
        });
      });
    };
  }

  _createClass(UploadModel, [{
    key: "getUploadHistory",
    value: function getUploadHistory() {
      (0, _ajax.getData)(this.uploadHistoryAPI).then(function (param) {
        console.log(param);
      });
    }
  }, {
    key: "clearUploadHistory",
    value: function clearUploadHistory() {
      (0, _ajax.getData)(this.clearuploadHistoryAPI).then(function (param) {
        console.log(param);
      });
    }
  }, {
    key: "deleteUploadListStatusItem",
    value: function deleteUploadListStatusItem(uid) {
      delete this.uploadListStatus[uid];
    }
  }, {
    key: "deleteRemoteImage",
    value: function deleteRemoteImage(token, onSuccess, onError) {
      (0, _ajax.getData)(token).then(function (param) {
        onSuccess(param);
      }).catch(function (e) {
        onError(e);
      });
    }
  }, {
    key: "abort",
    value: function abort(uid) {
      var _this2 = this;

      if (uid) {
        this.xhrQueue[uid].abort();
      } else {
        Object.keys(this.xhrQueue).forEach(function (id) {
          _this2.xhrQueue[id].abort();

          delete _this2.xhrQueue[id];
        });
      }
    }
  }, {
    key: "postFiles",
    get: function get() {
      var _this3 = this;

      var baseType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
      return this.rawFiles.filter(function (file, index) {
        var fileType = file.type.split('/')[1];

        if (baseType.indexOf(fileType) > -1) {
          var uid = "".concat(Date.now()).concat(index);
          file.uid = uid;
          _this3.uploadListStatus[uid] = {
            file: file,
            progress: null,
            remote: null,
            status: 'ready'
          };
          return true;
        } else {
          return false;
        }
      });
    }
  }, {
    key: "isXhrQueueEmpty",
    get: function get() {
      if (Object.keys(this.xhrQueue).length > 0) {
        console.log('上传队列尚未完成！');
        return false;
      } else {
        return true;
      }
    }
  }]);

  return UploadModel;
}();

exports.default = UploadModel;

tslib_1.__decorate([_mobx.observable], UploadModel.prototype, "rawFiles", void 0);

tslib_1.__decorate([_mobx.observable], UploadModel.prototype, "xhrQueue", void 0);

tslib_1.__decorate([_mobx.observable], UploadModel.prototype, "uploadListStatus", void 0);

tslib_1.__decorate([_mobx.observable], UploadModel.prototype, "remoteImageArray", void 0);

tslib_1.__decorate([_mobx.action], UploadModel.prototype, "getFileList", void 0);

tslib_1.__decorate([_mobx.computed], UploadModel.prototype, "postFiles", null);

tslib_1.__decorate([_mobx.computed], UploadModel.prototype, "isXhrQueueEmpty", null);

tslib_1.__decorate([_mobx.action], UploadModel.prototype, "deleteUploadListStatusItem", null);

tslib_1.__decorate([_mobx.action], UploadModel.prototype, "abort", null);

tslib_1.__decorate([_mobx.action], UploadModel.prototype, "doUpload", void 0);
},{"../utils/ajax":"../utils/ajax.ts"}],"../store/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UploadModel = _interopRequireDefault(require("../models/UploadModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stores = {
  upload: new _UploadModel.default()
};
var _default = stores;
exports.default = _default;
},{"../models/UploadModel":"../models/UploadModel.ts"}],"../layouts/Sidebar.tsx":[function(require,module,exports) {
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
    to: "/upload"
  }, "upload"), React.createElement(_reactRouterDom.NavLink, {
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
    _electron.ipcRenderer.once('ipc-running', function (event, args) {
      cb(args);
    });
  }
};
exports.default = _default;
var clipboard = {
  trigger: function trigger() {
    _electron.ipcRenderer.send('read-clipboard');
  },
  bind: function bind(cb) {
    _electron.ipcRenderer.on('get-clipboard-text', function (event, args) {
      cb(args);
    });
  },
  unbind: function unbind() {
    _electron.ipcRenderer.removeAllListeners('get-clipboard-text');
  }
};
exports.clipboard = clipboard;
var download = {
  trigger: function trigger(url, args) {
    _electron.ipcRenderer.send('file-download', url, args);
  },
  bind: function bind(cb) {
    _electron.ipcRenderer.on('on-download-state', function (event, args) {
      cb(args);
    });
  },
  unbind: function unbind() {
    _electron.ipcRenderer.removeAllListeners('on-download-state');
  }
}; // https://www.npmjs.com/package/electron-better-dialog

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

    _this.handleDownload = function () {
      var filePath = _this.state.filePath;

      if (_this.testPath(filePath)) {
        console.log(filePath);

        _bridge.download.trigger(filePath, {
          openFolderWhenDone: true,
          saveAs: true
        });
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
      });
    }
  }, {
    key: "handleSelectPath",
    value: function handleSelectPath() {
      (0, _bridge.selectFile)({
        properties: ['openDirectory', 'openFile']
      }, function (res) {
        console.log(res);
      });
    }
  }, {
    key: "showMessageBox",
    value: function showMessageBox() {
      (0, _bridge.messageBox)({
        betterButtons: [{
          isDefault: true,
          label: 'Default Button'
        }, {
          isCancel: true,
          label: 'Cancel Button'
        }, {
          data: {
            arbitrary: true
          },
          label: 'Action Button'
        }],
        message: 'Async'
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _bridge.clipboard.unbind();

      _bridge.download.unbind();
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
        onClick: this.handleDownload
      }, "\u70B9\u51FB\u4E0B\u8F7D\u6587\u4EF6"), React.createElement("button", {
        onClick: this.handlePaste
      }, "\u7C98\u8D34\u526A\u5207\u677F\u94FE\u63A5"), React.createElement("button", {
        onClick: this.handleSelectPath
      }, "\u9009\u62E9\u8DEF\u5F84"), React.createElement("button", {
        onClick: this.showMessageBox
      }, "\u5F39\u51FA\u6D88\u606F\u6846"));
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
      return React.createElement("div", null, "SyncView");
    }
  }]);

  return SyncView;
}(React.Component);

var _default = SyncView;
exports.default = _default;
},{}],"../views/Upload.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var tslib_1 = _interopRequireWildcard(require("tslib"));

var _mobxReact = require("mobx-react");

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

var UploadView =
/*#__PURE__*/
function (_React$Component) {
  _inherits(UploadView, _React$Component);

  function UploadView() {
    var _this;

    _classCallCheck(this, UploadView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UploadView).apply(this, arguments));

    _this.handleList = function () {
      if (_this.fileIpt) {
        _this.props.getFileList(_this.fileIpt);
      }
    };

    return _this;
  }

  _createClass(UploadView, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          clearUploadHistory = _this$props.clearUploadHistory,
          deleteUploadListStatusItem = _this$props.deleteUploadListStatusItem,
          doUpload = _this$props.doUpload,
          getUploadHistory = _this$props.getUploadHistory,
          uploadListStatus = _this$props.uploadListStatus,
          postFiles = _this$props.postFiles;
      var uids = Object.keys(uploadListStatus);
      return React.createElement("div", null, React.createElement("br", null), React.createElement("br", null), React.createElement("input", {
        type: "file",
        multiple: true,
        accept: "image/*",
        name: "smfile",
        ref: function ref(node) {
          _this2.fileIpt = node;
        },
        onChange: this.handleList,
        onDrop: this.handleList
      }), React.createElement("button", {
        onClick: doUpload
      }, "\u56FE\u7247\u4E0A\u4F20"), React.createElement("button", {
        onClick: getUploadHistory
      }, "\u83B7\u53D6\u4E0A\u4F20\u5386\u53F2"), React.createElement("button", {
        onClick: clearUploadHistory
      }, "\u6E05\u9664\u4E0A\u4F20\u5386\u53F2"), React.createElement("div", {
        style: {
          background: '#f4f4f4'
        }
      }, postFiles.map(function (item, i) {
        return React.createElement("div", {
          style: {
            borderBottom: '1px solid #ccc',
            fontSize: '10px'
          },
          key: i
        }, "name: ", item.name, " ", React.createElement("br", null), "path: ", item.path, " ", React.createElement("br", null), "size: ", item.size, " ", React.createElement("br", null));
      })), React.createElement("div", {
        style: {
          background: '#8aa7d2'
        }
      }, uids.length > 0 && uids.map(function (uid) {
        var item = uploadListStatus[uid];
        return React.createElement("div", {
          style: {
            borderBottom: '1px solid #51637d',
            fontSize: '12px'
          },
          key: uid
        }, "name: ", item.file.name, " ", React.createElement("br", null), "status: ", item.status, " ", React.createElement("br", null), "progress: ", item.progress ? item.progress.percent : 'error', " ", React.createElement("br", null), "link: ", item.remote ? React.createElement("a", {
          href: '#'
        }, item.remote.url) : 'null', React.createElement("button", {
          onClick: function onClick(e) {
            deleteUploadListStatusItem(uid);
          }
        }, "\u5220\u9664"));
      })));
    }
  }]);

  return UploadView;
}(React.Component);

UploadView = tslib_1.__decorate([(0, _mobxReact.inject)(function (stores) {
  var _stores$upload = stores.upload,
      postFiles = _stores$upload.postFiles,
      uploadListStatus = _stores$upload.uploadListStatus;
  return {
    clearUploadHistory: function clearUploadHistory() {
      return stores.upload.clearUploadHistory();
    },
    deleteUploadListStatusItem: function deleteUploadListStatusItem(e) {
      return stores.upload.deleteUploadListStatusItem(e);
    },
    doUpload: function doUpload() {
      return stores.upload.doUpload();
    },
    getFileList: function getFileList(node) {
      return stores.upload.getFileList(node);
    },
    getUploadHistory: function getUploadHistory() {
      return stores.upload.getUploadHistory();
    },
    postFiles: postFiles,
    uploadListStatus: uploadListStatus
  };
}), _mobxReact.observer], UploadView);
var _default = UploadView;
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

var _Upload = _interopRequireDefault(require("../views/Upload"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var App = function App() {
  return React.createElement("div", {
    className: "app-core"
  }, React.createElement(_reactRouterDom.Switch, null, React.createElement(_reactRouterDom.Route, {
    path: "/home",
    component: _Home.default
  }), React.createElement(_reactRouterDom.Route, {
    path: "/upload",
    component: _Upload.default
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
},{"../layouts/Sidebar":"../layouts/Sidebar.tsx","../views/Home":"../views/Home.tsx","../views/Mine":"../views/Mine.tsx","../views/Sync":"../views/Sync.tsx","../views/Upload":"../views/Upload.tsx"}],"../../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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

var _mobxReact = require("mobx-react");

var _mobxReactDevtools = require("mobx-react-devtools");

var React = _interopRequireWildcard(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _reactRouterDom = require("react-router-dom");

var _store = _interopRequireDefault(require("../store"));

var _App = _interopRequireDefault(require("./App"));

require("../assets/style/app.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

(0, _mobxReactDevtools.configureDevtool)({
  graphEnabled: false,
  logEnabled: true,
  logFilter: function logFilter(change) {
    return change.type === 'reaction';
  },
  updatesEnabled: false
});
ReactDOM.render(React.createElement(_mobxReact.Provider, Object.assign({}, _store.default), React.createElement(_reactRouterDom.HashRouter, {
  basename: "/"
}, React.createElement("div", {
  className: "app-container-wrap"
}, React.createElement(_App.default, null)))), document.getElementById("MOUNT_NODE"));
},{"../store":"../store/index.ts","./App":"App.tsx","../assets/style/app.scss":"../assets/style/app.scss"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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