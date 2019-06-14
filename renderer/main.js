process.env.HMR_PORT=52090;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils/file.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var fs = _interopRequireWildcard(require("fs-extra"));

var _path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var root = _path.join(__dirname, '../');

var saveFile = function saveFile(filePath, fileDataBuffer) {
  return new Promise(function (resolve, reject) {
    var wstream = fs.createWriteStream(filePath);
    wstream.on('open', function () {
      var blockSize = 128;
      var nbBlocks = Math.ceil(fileDataBuffer.length / blockSize);

      for (var i = 0; i < nbBlocks; i += 1) {
        var currentBlock = fileDataBuffer.slice(blockSize * i, Math.min(blockSize * (i + 1), fileDataBuffer.length));
        wstream.write(currentBlock);
      }

      wstream.end();
    });
    wstream.on('error', function (err) {
      reject(err);
    });
    wstream.on('finish', function () {
      resolve(true);
    });
  });
};

var _default = {
  JSON2File: function JSON2File(fileName, data) {
    var buf = Buffer.from(JSON.stringify(data, null, 2), 'utf8');
    saveFile(fileName, buf);
  },
  del: function del(filename) {
    var fileRelPath = _path.join(root, filename);

    if (fs.existsSync(fileRelPath)) {
      fs.unlinkSync(fileRelPath);
    }
  },
  exist: function exist(filename) {
    return fs.existsSync(_path.join(root, filename));
  },
  file2JSON: function file2JSON(filePath) {
    return JSON.parse(fs.readFileSync(_path.join(root, filePath), 'utf-8'));
  },
  path: function path(p) {
    return _path.join(root, p);
  },
  root: root,
  saveFile: saveFile
};
exports.default = _default;
},{}],"core/winStateKeeper.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var windowStateKeeper = require('electron-window-state');

var winStateKeeper = function winStateKeeper(opts) {
  var width = opts.width,
      height = opts.height;
  var winState = windowStateKeeper({
    defaultHeight: height,
    defaultWidth: width
  });
  var win = new _electron.BrowserWindow(Object.assign({}, opts, {
    x: winState.x,
    y: winState.y,
    width: winState.width,
    height: winState.height
  }));
  winState.manage(win);
  return win;
};

var _default = winStateKeeper;
exports.default = _default;
},{}],"core/winCreate.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var url = _interopRequireWildcard(require("url"));

var _file = _interopRequireDefault(require("../utils/file"));

var _winStateKeeper = _interopRequireDefault(require("./winStateKeeper"));

var _electron = require("electron");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var winCreate = function winCreate(opts, entry, parentWindow, isChild) {
  var options = {
    appIcon: _file.default.path('resources/dock.png'),
    center: true,
    frame: false,
    fullscreenable: false,
    icon: _file.default.path('resources/dock.ico'),
    titleBarStyle: 'hidden',
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true,
      webviewTag: true
    },
    resizable: true
  };

  if (process.platform === 'darwin') {
    options.vibrancy = 'appearance-based';
  } else {
    options.backgroundColor = '#fff';
  }

  Object.assign(options, opts);
  var mainWindow;

  if (isChild) {
    Object.assign(options, {
      parent: parentWindow
    });
    mainWindow = new _electron.BrowserWindow(options);
    mainWindow.once('ready-to-show', function () {
      mainWindow.show();
    });
  } else {
    mainWindow = (0, _winStateKeeper.default)(options);
  }

  var entryUrl = typeof entry === 'string' ? entry : url.format({
    pathname: _file.default.path(entry.pathname),
    protocol: 'file:',
    slashes: true,
    hash: entry.hash
  });
  mainWindow.loadURL(entryUrl);
  mainWindow.hide();
  return mainWindow;
};

var _default = winCreate;
exports.default = _default;
},{"../utils/file":"utils/file.ts","./winStateKeeper":"core/winStateKeeper.ts"}],"core/rpc.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _events = require("events");

var _electron = require("electron");

var uuid = _interopRequireWildcard(require("uuid"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Server =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(Server, _EventEmitter);

  function Server(win) {
    var _this;

    (0, _classCallCheck2.default)(this, Server);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Server).call(this));
    _this.win = null;
    _this.destroyed = false;
    _this.id = '';
    _this.win = win;
    _this.ipcListener = _this.ipcListener.bind((0, _assertThisInitialized2.default)(_this));
    _this.dispatch = _this.dispatch.bind((0, _assertThisInitialized2.default)(_this));
    _this.destroy = _this.destroy.bind((0, _assertThisInitialized2.default)(_this));

    if (_this.destroyed) {
      return (0, _possibleConstructorReturn2.default)(_this);
    }

    var uid = uuid.v4();
    _this.id = uid;

    _electron.ipcMain.on(uid, _this.ipcListener);

    if (_this.wc) {
      _this.wc.on('did-finish-load', function () {
        _this.wc && _this.wc.send('init', uid);
      });
    }

    return _this;
  }

  (0, _createClass2.default)(Server, [{
    key: "ipcListener",
    value: function ipcListener(event, _ref) {
      var ev = _ref.ev,
          data = _ref.data;
      (0, _get2.default)((0, _getPrototypeOf2.default)(Server.prototype), "emit", this).call(this, ev, data);
    }
  }, {
    key: "dispatch",
    value: function dispatch(ch, data) {
      if (this.win && !this.win.isDestroyed()) {
        this.wc && this.wc.send(this.id, {
          ch: ch,
          data: data
        });
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeAllListeners();
      this.wc && this.wc.removeAllListeners();

      if (this.id) {
        _electron.ipcMain.removeListener(this.id, this.ipcListener);
      } else {
        this.destroyed = true;
      }
    }
  }, {
    key: "wc",
    get: function get() {
      if (this.win) {
        return this.win.webContents;
      } else {
        return null;
      }
    }
  }]);
  return Server;
}(_events.EventEmitter);

var _default = function _default(win) {
  return new Server(win);
};

exports.default = _default;
},{}],"utils/readTxtByLine.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electronLog = _interopRequireDefault(require("electron-log"));

var fs = _interopRequireWildcard(require("fs"));

var readline = _interopRequireWildcard(require("readline"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(filePath, cb, done) {
  _electronLog.default.debug(filePath);

  var rl = readline.createInterface({
    input: fs.createReadStream(filePath)
  });
  var i = 1;
  rl.on('line', function (line) {
    cb(i, line);
    i++;
  });
  rl.on('close', done);
};

exports.default = _default;
},{}],"utils/crypto.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aseDecode = exports.aseEncode = void 0;

var crypto = _interopRequireWildcard(require("crypto"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var aseEncode = function aseEncode(data, password, iv) {
  if (password.length !== 16 || iv.length !== 16) {
    return '';
  }

  var cipher = crypto.createCipheriv('aes-128-cbc', password, iv);
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

exports.aseEncode = aseEncode;

var aseDecode = function aseDecode(data, password, iv) {
  if (password.length !== 16 || iv.length !== 16) {
    return '';
  }

  var decipher = crypto.createDecipheriv('aes-128-cbc', password, iv);
  var decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

exports.aseDecode = aseDecode;
},{}],"utils/tray.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _file = _interopRequireDefault(require("./file"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isWin = process.platform === 'win32';

var _default = function _default(RPC) {
  var img = isWin ? _file.default.path('resources/dock.ico') : _file.default.path('resources/icon.png');
  var appIcon = new _electron.Tray(img);

  var menu = _electron.Menu.buildFromTemplate([{
    click: function click() {
      RPC.dispatch('history-push', '/sync');
      RPC.win.show();
      RPC.win.focus();
    },
    label: '设置'
  }, {
    type: 'separator'
  }, {
    click: function click() {
      _electron.shell.openExternal('https://github.com/halo-design/Altas');
    },
    label: '关于'
  }, {
    click: function click() {
      _electron.app.quit();
    },
    label: '退出'
  }]);

  appIcon.setContextMenu(menu);
  return appIcon;
};

exports.default = _default;
},{"./file":"utils/file.ts"}],"utils/env.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.langIsAvailable = exports.cmdIsAvailable = void 0;

var _electronLog = _interopRequireDefault(require("electron-log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('child_process'),
    execSync = _require.execSync,
    spawnSync = _require.spawnSync;

if (process.platform === 'darwin') {
  process.env.PATH = process.env.PATH + ':/usr/local/bin';
}

var cmdIsAvailable = function cmdIsAvailable(cmd) {
  try {
    var outBuffer = execSync(cmd, {
      stdio: 'pipe'
    });
    var outText = outBuffer.toString('utf8').replace(/\n/g, '');

    _electronLog.default.info(outText);

    return outText;
  } catch (e) {
    return false;
  }
};

exports.cmdIsAvailable = cmdIsAvailable;

var langIsAvailable = function langIsAvailable(cmd, argArr) {
  try {
    var out = spawnSync(cmd, argArr, {
      stdio: 'pipe'
    });
    var outText = out.stderr.toString('utf8').replace(/\n/g, '');

    _electronLog.default.info(outText);

    return outText;
  } catch (e) {
    return false;
  }
};

exports.langIsAvailable = langIsAvailable;
},{}],"utils/projectRunner.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var fs = _interopRequireWildcard(require("fs-extra"));

var path = _interopRequireWildcard(require("path"));

var _electronLog = _interopRequireDefault(require("electron-log"));

var _env = require("../utils/env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var readYaml = require('read-yaml');

var hasYarn = (0, _env.cmdIsAvailable)('yarn -v');
var isMac = process.platform === 'darwin';

var _default = function _default(projectPath) {
  var projectIsExists = fs.existsSync(projectPath);

  if (projectIsExists) {
    var configPath = path.join(projectPath, 'altas.yml');
    var isConfigExists = fs.existsSync(configPath);
    var isNodeModulesExists = fs.existsSync(path.join(projectPath, 'node_modules'));
    var commander = hasYarn ? 'yarn ' : 'npm ';
    var sudo = isMac ? 'sudo ' : '';
    var commandLine = sudo + commander + 'install';
    var commandConfig = {
      name: '安装npm依赖包',
      shell: commandLine,
      needCancel: false
    };

    if (isConfigExists) {
      var config = readYaml.sync(configPath);

      if (!isNodeModulesExists) {
        config.command.unshift(commandConfig);
      }

      var result = {
        noProject: false,
        noConfig: false,
        configList: config
      };

      _electronLog.default.info(result);

      return result;
    } else {
      return {
        noProject: false,
        noConfig: true,
        configList: {
          command: []
        }
      };
    }
  } else {
    return {
      noProject: true,
      noConfig: true,
      configList: {
        command: []
      }
    };
  }
};

exports.default = _default;
},{"../utils/env":"utils/env.ts"}],"../../package.json":[function(require,module,exports) {
module.exports = {
  "name": "altas",
  "version": "0.2.7",
  "description": "An Electron Application",
  "main": "renderer/main.js",
  "scripts": {
    "clear": "ts-node ./bin clear",
    "update": "yarn upgrade-interactive --latest",
    "serve": "ts-node ./bin serve",
    "Wbuild": "ts-node ./bin Wbuild",
    "Wbuild:p": "ts-node ./bin Wbuild -p",
    "Nbuild": "ts-node ./bin Nbuild",
    "Nbuild:p": "ts-node ./bin Nbuild -p",
    "build": "npm run clear && npm run Wbuild && npm run Nbuild",
    "build:p": "npm run clear && npm run Wbuild:p && npm run Nbuild:p",
    "start": "ts-node ./bin app",
    "preview": "ts-node ./bin app --with-build",
    "postinstall": "electron-builder install-app-deps && npm run rebuild",
    "rebuild": "electron-rebuild -f -w node-pty --update-binary",
    "pack:mac": "ts-node ./bin pack --mac --with-build",
    "pack:win": "ts-node ./bin pack --win --with-build",
    "pack": "ts-node ./bin pack --win --mac --with-build",
    "lint": "ts-node ./bin lint",
    "lint:fix": "ts-node ./bin lint --fix",
    "upload:mac": "ts-node ./bin/upload --platform mac",
    "upload:win": "ts-node ./bin/upload --platform win",
    "upload": "ts-node ./bin/upload --platform all"
  },
  "keywords": ["Electron", "React", "TypeScript", "Parcel"],
  "repository": {
    "type": "git",
    "url": "https://github.com/halo-design/Altas.git"
  },
  "author": "OwlAford",
  "license": "MIT",
  "engines": {
    "node": ">=8"
  },
  "devDependencies": {
    "@babel/core": "7.4.5",
    "@babel/plugin-transform-runtime": "^7.4.4",
    "@babel/preset-env": "^7.4.5",
    "@babel/preset-react": "^7.0.0",
    "@babel/preset-typescript": "^7.3.3",
    "@babel/runtime": "^7.4.5",
    "@types/classnames": "^2.2.8",
    "@types/electron-json-storage": "^4.0.0",
    "@types/fs-extra": "^7.0.0",
    "@types/ip": "^1.1.0",
    "@types/node": "^12.0.8",
    "@types/object-hash": "^1.3.0",
    "@types/qs": "^6.5.3",
    "@types/react": "^16.8.19",
    "@types/react-dom": "^16.8.4",
    "@types/react-router": "^5.0.1",
    "@types/react-router-dom": "^4.3.3",
    "@types/uuid": "^3.4.4",
    "autoprefixer": "^9.6.0",
    "babel-plugin-import": "^1.12.0",
    "commander": "^2.20.0",
    "cross-env": "^5.2.0",
    "devtron": "^1.4.0",
    "electron": "^5.0.3",
    "electron-builder": "20.43.0",
    "electron-rebuild": "^1.8.5",
    "node-sass": "^4.12.0",
    "node-ssh": "^6.0.0",
    "ora": "^3.4.0",
    "parcel-bundler": "1.12.3",
    "postcss-modules": "^1.4.1",
    "prettier": "^1.18.2",
    "sass": "^1.21.0",
    "stylelint": "^10.1.0",
    "stylelint-config-standard": "^18.3.0",
    "stylelint-scss": "^3.8.0",
    "ts-node": "^8.2.0",
    "tslint": "^5.17.0",
    "tslint-plugin-prettier": "^2.0.1",
    "tslint-react": "^4.0.0",
    "typescript": "^3.5.1"
  },
  "dependencies": {
    "antd": "^3.19.3",
    "classnames": "^2.2.6",
    "decompress-zip": "^0.2.2",
    "electron-better-dialog": "^1.0.6",
    "electron-dl": "^1.14.0",
    "electron-json-storage": "^4.1.6",
    "electron-log": "^3.0.6",
    "electron-window-state": "^5.0.3",
    "face-api.js": "^0.20.0",
    "fs-extra": "^8.0.1",
    "ip": "^1.1.5",
    "lodash": "^4.17.11",
    "mobx": "^5.10.1",
    "mobx-react": "^6.0.3",
    "mobx-react-devtools": "6.1.1",
    "mobx-react-router": "^4.0.7",
    "node-pty": "0.9.0-beta13",
    "object-hash": "^1.3.1",
    "qs": "^6.7.0",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-router": "5.0.1",
    "react-router-dom": "5.0.1",
    "read-yaml": "^1.1.0",
    "tslib": "^1.10.0",
    "uuid": "^3.3.2",
    "xterm": "^3.14.2",
    "yaml": "^1.6.0"
  }
};
},{}],"core/bridge.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var path = _interopRequireWildcard(require("path"));

var _electron = require("electron");

var _file = _interopRequireDefault(require("../utils/file"));

var _readTxtByLine = _interopRequireDefault(require("../utils/readTxtByLine"));

var _electronLog = _interopRequireDefault(require("electron-log"));

var storage = _interopRequireWildcard(require("electron-json-storage"));

var ip = _interopRequireWildcard(require("ip"));

var os = _interopRequireWildcard(require("os"));

var hash = _interopRequireWildcard(require("object-hash"));

var crypto = _interopRequireWildcard(require("../utils/crypto"));

var _tray = _interopRequireDefault(require("../utils/tray"));

var _winCreate = _interopRequireDefault(require("./winCreate"));

var _electronBetterDialog = require("electron-better-dialog");

var _electronDl = _interopRequireDefault(require("electron-dl"));

var uuid = _interopRequireWildcard(require("uuid"));

var _env = require("../utils/env");

var _projectRunner = _interopRequireDefault(require("../utils/projectRunner"));

var fs = _interopRequireWildcard(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var pkg = require('../../../package.json');

var _default = function _default(RPC) {
  var dispatch = RPC.dispatch,
      win = RPC.win;
  var windowContainer = {};
  var tray = null;

  if (win) {
    tray = (0, _tray.default)(RPC);
    tray.setToolTip('Altas ' + pkg.version);
    RPC.on('read-app-info', function () {
      dispatch('get-app-info', pkg);
    });
    RPC.on('set-tray-title', function (args) {
      tray.setTitle(args);
    });
    tray.on('click', function () {
      win.isVisible() ? win.hide() : win.show();
    });
  }

  RPC.on('get-appdir', function () {
    dispatch('appdir', {
      root: _file.default.root
    });
  });
  RPC.on('write-storage', function (_ref) {
    var key = _ref.key,
        data = _ref.data;
    storage.set(key, data, function (err) {
      if (err) {
        throw err;
      } else {
        _electronLog.default.info(data);

        _electronLog.default.info("[".concat(key, "]\uFF1A\u6570\u636E\u5DF2\u5199\u5165"));
      }
    });
  });
  RPC.on('read-storage', function (key) {
    storage.get(key, function (err, data) {
      _electronLog.default.info(data);

      _electronLog.default.info("[".concat(key, "]\uFF1A\u6570\u636E\u5DF2\u8BFB\u53D6"));

      dispatch('get-storage' + key, data);
    });
  });
  RPC.on('remove-storage', function (key) {
    storage.remove(key, function (err) {
      _electronLog.default.error(err);
    });

    _electronLog.default.info("[".concat(key, "]\uFF1A\u6570\u636E\u5DF2\u5220\u9664"));
  });
  RPC.on('on-dialog-message', function (args) {
    win && (0, _electronBetterDialog.showBetterMessageBox)(win, args);
  });
  RPC.on('read-text', function (args) {
    (0, _readTxtByLine.default)(args, function (index, line) {
      var params = {
        index: index,
        line: line,
        status: 'pending'
      };
      dispatch('get-text-line', params);
    }, function () {
      dispatch('get-text-line', {
        status: 'done'
      });
    });
  });
  var dlItem;
  RPC.on('file-download', function (_ref2) {
    var url = _ref2.url,
        args = _ref2.args;
    var timer;

    var createTimer = function createTimer() {
      var timeout = args.timeout;

      if (timeout) {
        timer = setTimeout(function () {
          if (dlItem) {
            dlItem.cancel();

            _electronLog.default.error(url + '[下载超时，已取消]');
          }
        }, timeout);
      }
    };

    if (!win) {
      return;
    }

    _electronDl.default.download(win, url, Object.assign({
      onCancel: function onCancel() {
        if (timer) {
          clearTimeout(timer);
        }

        dispatch('on-download-state', {
          index: args.index || 0,
          progress: 0,
          status: 'cancel'
        });
      },
      onProgress: function onProgress(e) {
        if (timer) {
          clearTimeout(timer);
        }

        createTimer();
        dispatch('on-download-state', {
          index: args.index || 0,
          progress: e,
          status: 'running'
        });
      },
      onStarted: function onStarted(e) {
        dlItem = e;
        createTimer();
        dispatch('on-download-state', {
          index: args.index || 0,
          progress: 0,
          status: 'start'
        });
      }
    }, args)).then(function (dl) {
      if (timer) {
        clearTimeout(timer);
      }

      _electronLog.default.debug(dl.getSavePath());

      dispatch('on-download-state', {
        index: args.index || 0,
        progress: 1,
        status: 'finished'
      });
    }).catch(function () {
      if (timer) {
        clearTimeout(timer);
      }

      dispatch('on-download-state', {
        index: args.index || 0,
        progress: 0,
        status: 'error'
      });
    });
  });
  RPC.on('file-download-cancel', function () {
    if (dlItem) {
      dlItem.cancel();
    }
  });
  RPC.on('read-clipboard', function () {
    dispatch('get-clipboard-text', _electron.clipboard.readText());
  });
  RPC.on('write-clipboard', function (args) {
    _electron.clipboard.writeText(args);
  });
  RPC.on('get-ip-address', function () {
    var network = {
      ip: ''
    };
    network.ip = ip.address();
    dispatch('ip-address', network);
  });
  RPC.on('get-device-os', function () {
    var deviceInfo = {
      arch: os.arch(),
      cpu: os.cpus(),
      homedir: os.homedir(),
      hostname: os.hostname(),
      memory: os.totalmem(),
      network: os.networkInterfaces(),
      platform: os.platform(),
      release: os.release(),
      tmpdir: os.tmpdir(),
      type: os.type(),
      uptime: os.uptime(),
      userInfo: os.userInfo()
    };
    dispatch('device-os', deviceInfo);
  });
  RPC.on('aes-encode', function (args) {
    var mdString = hash.MD5(args.pswd);
    var key = mdString.slice(0, 16);
    var iv = mdString.slice(16);
    dispatch('get-aes-encode', crypto.aseEncode(args.data, key, iv));
  });
  RPC.on('aes-decode', function (args) {
    var mdString = hash.MD5(args.pswd);
    var key = mdString.slice(0, 16);
    var iv = mdString.slice(16);
    dispatch('get-aes-decode', crypto.aseDecode(args.data, key, iv));
  });
  RPC.on('create-window', function (args) {
    if (!win) {
      return;
    }

    var childWin = (0, _winCreate.default)(args.options, args.entry, win, true);
    var uid = uuid.v4();
    windowContainer[uid] = childWin;
    dispatch('get-window-id', {
      win_uid: uid
    });
  });
  RPC.on('close-window', function (args) {
    if (args.uid in windowContainer) {
      var targetWin = windowContainer[args.uid];

      if (!targetWin.isDestroyed()) {
        targetWin.close();
      }
    }
  });
  RPC.on('detect-support-env', function (args) {
    var es = [{
      name: 'Node.js',
      icon_name: 'node',
      version: (0, _env.cmdIsAvailable)('node -v'),
      download_lnk: 'http://nodejs.cn/download/'
    }, {
      name: 'NPM',
      icon_name: 'npm',
      version: (0, _env.cmdIsAvailable)('npm -v'),
      download_lnk: 'http://caibaojian.com/npm/all.html'
    }, {
      icon_name: 'vue',
      name: 'Vue CLI',
      version: (0, _env.cmdIsAvailable)('vue -V'),
      download_lnk: 'https://cli.vuejs.org/zh/guide/prototyping.html'
    }, {
      icon_name: 'yarn',
      name: 'Yarn',
      version: (0, _env.cmdIsAvailable)('yarn -v'),
      download_lnk: 'https://yarn.bootcss.com/docs/install/'
    }, {
      name: 'Python',
      icon_name: 'python',
      version: (0, _env.langIsAvailable)('python', ['-V']),
      download_lnk: 'https://www.python.org/getit/'
    }];
    dispatch('get-support-env', {
      env_support: es
    });
  });
  RPC.on('create-project', function (args) {
    var optputDir = path.join(args.projectPath, args.projectName);

    _electronLog.default.info(args);

    var url = 'http://owlaford.gitee.io/media/demo/vue-basic.zip';

    if (!win) {
      return;
    }

    _electronDl.default.download(win, url, {
      directory: _electron.app.getPath('temp'),
      onProgress: function onProgress(e) {
        dispatch('get-repo', {
          step: 'download',
          status: 'running',
          state: {
            progress: e
          }
        });
      }
    }).then(function (dl) {
      var tempFileSavePath = dl.getSavePath();
      dispatch('get-repo', {
        step: 'download',
        status: 'finished',
        state: {
          progress: 1
        }
      });

      if (fs.existsSync(optputDir)) {
        dispatch('get-repo', {
          step: 'unzip',
          status: 'error',
          state: {
            errorText: '该文件夹已存在，无法完成解压！',
            optputDir: optputDir,
            fileIndex: 0,
            fileCount: 0
          }
        });
        return;
      }

      var DecompressZip = require('decompress-zip');

      var unzipper = new DecompressZip(tempFileSavePath);
      unzipper.on('error', function () {
        dispatch('get-repo', {
          step: 'unzip',
          status: 'error',
          state: {
            errorText: '文件解压出错！',
            fileIndex: 0,
            fileCount: 0
          }
        });
      });
      unzipper.on('progress', function (fileIndex, fileCount) {
        dispatch('get-repo', {
          step: 'unzip',
          status: 'running',
          state: {
            fileIndex: fileIndex,
            fileCount: fileCount
          }
        });
      });
      unzipper.on('extract', function (log) {
        dispatch('get-repo', {
          step: 'unzip',
          status: 'finished',
          state: {
            log: log,
            optputDir: optputDir,
            fileIndex: 0,
            fileCount: 0
          }
        });
      });
      unzipper.extract({
        path: optputDir,
        filter: function filter(file) {
          return file.type !== 'SymbolicLink';
        }
      });

      _electronLog.default.debug(optputDir);
    }).catch(function () {
      dispatch('get-repo', {
        step: 'download',
        status: 'error',
        state: {
          errorText: '文件下载出错！',
          progress: 0
        }
      });
    });
  });
  RPC.on('detect-runner-config', function (args) {
    var projectPath = args.projectPath;

    if (projectPath) {
      var config = (0, _projectRunner.default)(projectPath);
      dispatch('get-runner-config', config);
    }
  });
  return {
    tray: tray
  };
};

exports.default = _default;
},{"../utils/file":"utils/file.ts","../utils/readTxtByLine":"utils/readTxtByLine.ts","../utils/crypto":"utils/crypto.ts","../utils/tray":"utils/tray.ts","./winCreate":"core/winCreate.ts","../utils/env":"utils/env.ts","../utils/projectRunner":"utils/projectRunner.ts","../../../package.json":"../../package.json"}],"main.ts":[function(require,module,exports) {
"use strict";

var _electron = require("electron");

var _winCreate = _interopRequireDefault(require("./core/winCreate"));

var _rpc = _interopRequireDefault(require("./core/rpc"));

var _bridge = _interopRequireDefault(require("./core/bridge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainWindow;
var forceQuit = false;

var init = function init() {
  mainWindow = (0, _winCreate.default)({
    height: 648,
    width: 1050,
    minWidth: 980,
    minHeight: 620
  }, {
    pathname: 'renderer/index.html',
    hash: ''
  });
  var RPC = (0, _rpc.default)(mainWindow);

  var _createBridge = (0, _bridge.default)(RPC),
      tray = _createBridge.tray;

  mainWindow.on('close', function (e) {
    if (forceQuit) {
      tray.destroy();
      mainWindow.removeAllListeners();
      mainWindow = null;

      _electron.app.quit();
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  if (!_electron.app.isPackaged) {
    require('devtron').install();
  }
};

_electron.app.on('ready', init);

_electron.app.on('before-quit', function () {
  forceQuit = true;
});

_electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    _electron.app.quit();
  }
});

_electron.app.on('activate', function () {
  if (mainWindow === null) {
    init();
  } else {
    mainWindow.show();
  }
});
},{"./core/winCreate":"core/winCreate.ts","./core/rpc":"core/rpc.ts","./core/bridge":"core/bridge.ts"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = process.env.HMR_HOSTNAME || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + process.env.HMR_PORT + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
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
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
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

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
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

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
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
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)