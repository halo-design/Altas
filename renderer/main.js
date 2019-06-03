process.env.HMR_PORT=0;process.env.HMR_HOSTNAME="localhost";parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"utils/file.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("fs-extra")),r=t(require("path"));function t(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};n.get||n.set?Object.defineProperty(r,t,n):r[t]=e[t]}return r.default=e,r}var n=r.join(__dirname,"../"),i=function(r,t){return new Promise(function(n,i){var o=e.createWriteStream(r);o.on("open",function(){for(var e=Math.ceil(t.length/128),r=0;r<e;r+=1){var n=t.slice(128*r,Math.min(128*(r+1),t.length));o.write(n)}o.end()}),o.on("error",function(e){i(e)}),o.on("finish",function(){n(!0)})})},o={JSON2File:function(e,r){var t=Buffer.from(JSON.stringify(r,null,2),"utf8");i(e,t)},del:function(t){var i=r.join(n,t);e.existsSync(i)&&e.unlinkSync(i)},exist:function(t){return e.existsSync(r.join(n,t))},file2JSON:function(t){return JSON.parse(e.readFileSync(r.join(n,t),"utf-8"))},path:function(e){return r.join(n,e)},root:n,saveFile:i};exports.default=o;
},{}],"core/winStateKeeper.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("electron"),t=require("electron-window-state"),r=function(r){var i=r.width,d=r.height,o=t({defaultHeight:d,defaultWidth:i}),a=new e.BrowserWindow(Object.assign({},r,{x:o.x,y:o.y,width:o.width,height:o.height}));return o.manage(a),a},i=r;exports.default=i;
},{}],"core/winCreate.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("url")),r=o(require("../utils/file")),t=o(require("./winStateKeeper")),a=require("electron");function o(e){return e&&e.__esModule?e:{default:e}}function n(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var a=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};a.get||a.set?Object.defineProperty(r,t,a):r[t]=e[t]}return r.default=e,r}var s=function(o,n,s,l){var c,i={appIcon:r.default.path("resources/dock.png"),center:!0,frame:!1,fullscreenable:!1,icon:r.default.path("resources/dock.ico"),titleBarStyle:"hidden",transparent:!1,webPreferences:{nodeIntegration:!0,scrollBounce:!0},resizable:!0};"darwin"===process.platform?i.vibrancy="appearance-based":i.backgroundColor="#fff",Object.assign(i,o),l?(Object.assign(i,{parent:s}),c=new a.BrowserWindow(i)):c=(0,t.default)(i);var u=e.format({pathname:r.default.path(n.pathname),protocol:"file:",slashes:!0,hash:n.hash});return c.loadURL(u),c},l=s;exports.default=l;
},{"../utils/file":"utils/file.ts","./winStateKeeper":"core/winStateKeeper.ts"}],"core/rpc.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=c(require("@babel/runtime/helpers/classCallCheck")),t=c(require("@babel/runtime/helpers/createClass")),i=c(require("@babel/runtime/helpers/possibleConstructorReturn")),r=c(require("@babel/runtime/helpers/assertThisInitialized")),n=c(require("@babel/runtime/helpers/getPrototypeOf")),s=c(require("@babel/runtime/helpers/get")),u=c(require("@babel/runtime/helpers/inherits")),l=require("events"),a=require("electron"),d=o(require("uuid"));function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,i):{};r.get||r.set?Object.defineProperty(t,i,r):t[i]=e[i]}return t.default=e,t}function c(e){return e&&e.__esModule?e:{default:e}}var f=function(l){function o(t){var s;if((0,e.default)(this,o),(s=(0,i.default)(this,(0,n.default)(o).call(this))).win=null,s.destroyed=!1,s.id="",s.win=t,s.ipcListener=s.ipcListener.bind((0,r.default)(s)),s.dispatch=s.dispatch.bind((0,r.default)(s)),s.destroy=s.destroy.bind((0,r.default)(s)),s.destroyed)return(0,i.default)(s);var u=d.v4();return s.id=u,a.ipcMain.on(u,s.ipcListener),s.wc&&s.wc.on("did-finish-load",function(){s.wc&&s.wc.send("init",u)}),s}return(0,u.default)(o,l),(0,t.default)(o,[{key:"ipcListener",value:function(e,t){var i=t.ev,r=t.data;(0,s.default)((0,n.default)(o.prototype),"emit",this).call(this,i,r)}},{key:"dispatch",value:function(e,t){this.win&&!this.win.isDestroyed()&&this.wc&&this.wc.send(this.id,{ch:e,data:t})}},{key:"destroy",value:function(){this.removeAllListeners(),this.wc&&this.wc.removeAllListeners(),this.id?a.ipcMain.removeListener(this.id,this.ipcListener):this.destroyed=!0}},{key:"wc",get:function(){return this.win?this.win.webContents:null}}]),o}(l.EventEmitter),h=function(e){return new f(e)};exports.default=h;
},{}],"utils/readTxtByLine.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("electron-log")),r=o(require("fs")),t=o(require("readline"));function o(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var o=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};o.get||o.set?Object.defineProperty(r,t,o):r[t]=e[t]}return r.default=e,r}function n(e){return e&&e.__esModule?e:{default:e}}var u=function(o,n,u){e.default.debug(o);var i=t.createInterface({input:r.createReadStream(o)}),a=1;i.on("line",function(e){n(a,e),a++}),i.on("close",u)};exports.default=u;
},{}],"utils/crypto.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.aseDecode=exports.aseEncode=void 0;var e=r(require("crypto"));function r(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};n.get||n.set?Object.defineProperty(r,t,n):r[t]=e[t]}return r.default=e,r}var t=function(r,t,n){if(16!==t.length||16!==n.length)return"";var o=e.createCipheriv("aes-128-cbc",t,n),c=o.update(r,"utf8","hex");return c+=o.final("hex")};exports.aseEncode=t;var n=function(r,t,n){if(16!==t.length||16!==n.length)return"";var o=e.createDecipheriv("aes-128-cbc",t,n),c=o.update(r,"hex","utf8");return c+=o.final("utf-8")};exports.aseDecode=n;
},{}],"utils/tray.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("electron"),t=r(require("./file"));function r(e){return e&&e.__esModule?e:{default:e}}var o="win32"===process.platform,l=function(r){var l=o?t.default.path("resources/dock.ico"):t.default.path("resources/icon.png"),n=new e.Tray(l),u=e.Menu.buildFromTemplate([{click:function(){r.dispatch("history-push","/sync"),r.win.show(),r.win.focus()},label:"设置"},{type:"separator"},{click:function(){e.shell.openExternal("https://github.com/halo-design/Altas")},label:"关于"},{click:function(){e.app.quit()},label:"退出"}]);return n.setContextMenu(u),n};exports.default=l;
},{"./file":"utils/file.ts"}],"utils/env.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.supportEnv=exports.langIsAvailable=exports.cmdIsAvailable=void 0;var n=require("child_process"),e=n.execSync,o=n.spawnSync,t=function(n){try{return e(n,{stdio:"pipe"}).toString("utf8").replace(/\n/g,"")}catch(o){return!1}};exports.cmdIsAvailable=t;var r=function(n,e){try{return o(n,e,{stdio:"pipe"}).stderr.toString("utf8").replace(/\n/g,"")}catch(t){return!1}};exports.langIsAvailable=r;var a=function(){return[{name:"Node.js",icon_name:"node",version:t("node -v"),download_lnk:"http://nodejs.cn/download/"},{name:"NPM",icon_name:"npm",version:t("npm -v"),download_lnk:"http://caibaojian.com/npm/all.html"},{icon_name:"vue",name:"Vue CLI",version:t("vue -V"),download_lnk:"https://cli.vuejs.org/zh/guide/prototyping.html"},{icon_name:"yarn",name:"Yarn",version:t("yarn -v"),download_lnk:"https://yarn.bootcss.com/docs/install/"},{name:"Python",icon_name:"python",version:r("python",["-V"]),download_lnk:"https://www.python.org/getit/"}]};exports.supportEnv=a;
},{}],"../../package.json":[function(require,module,exports) {
module.exports={name:"altas",version:"0.2.6",description:"An Electron Application",main:"renderer/main.js",scripts:{clear:"ts-node ./bin/clear --dir renderer/static",update:"yarn upgrade-interactive --latest",serve:"ts-node ./bin/bundle --mode dev","compile:extra":"ts-node ./bin/bundle --mode extra","compile:main":"ts-node ./bin/bundle --mode main","compile:renderer":"ts-node ./bin/bundle --mode prod",compile:"npm run compile:main && npm run compile:extra && npm run compile:renderer",dev:"npm run clear && npm run compile:extra && npm run serve",build:"npm run clear && npm run compile",start:"npm run compile:main && cross-env NODE_ENV=development electron ./renderer/main.js",postinstall:"electron-builder install-app-deps && npm run rebuild",rebuild:"electron-rebuild -f -w node-pty --update-binary","pack:mac":"electron-builder --mac","pack:win":"electron-builder --win",pack:"npm run build && npm run pack:win && npm run pack:mac",tslint:"tslint -c tslint.yml '**/*.ts?(x)' --fix",jslint:"prettier -c '**/*.js' --write",stylelint:"stylelint '**/*.scss' --fix",lint:"npm run tslint && npm run jslint && npm run stylelint","upload:mac":"ts-node ./bin/upload --platform mac","upload:win":"ts-node ./bin/upload --platform win",upload:"ts-node ./bin/upload --platform all"},keywords:["Electron","React","TypeScript","Parcel"],repository:{type:"git",url:"https://github.com/halo-design/Altas.git"},author:"OwlAford",license:"MIT",engines:{node:">=8"},devDependencies:{"@babel/core":"7.4.5","@babel/plugin-transform-runtime":"^7.4.4","@babel/preset-env":"^7.4.5","@babel/preset-react":"^7.0.0","@babel/preset-typescript":"^7.3.3","@babel/runtime":"^7.4.5","@types/classnames":"^2.2.8","@types/electron-json-storage":"^4.0.0","@types/fs-extra":"^7.0.0","@types/ip":"^1.1.0","@types/node":"^12.0.4","@types/object-hash":"^1.2.0","@types/react":"^16.8.19","@types/react-dom":"^16.8.4","@types/react-router":"^5.0.1","@types/react-router-dom":"^4.3.3","@types/uuid":"^3.4.4",autoprefixer:"^9.5.1","babel-plugin-import":"^1.12.0","cross-env":"^5.2.0",electron:"^5.0.2","electron-builder":"20.41.0","electron-rebuild":"^1.8.5","node-sass":"^4.12.0","node-ssh":"^6.0.0",ora:"^3.4.0","parcel-bundler":"1.12.3","postcss-modules":"^1.4.1",prettier:"^1.17.1",sass:"^1.20.3",stylelint:"^10.0.1","stylelint-config-standard":"^18.3.0","stylelint-scss":"^3.8.0","ts-node":"^8.2.0",tslint:"^5.17.0","tslint-plugin-prettier":"^2.0.1","tslint-react":"^4.0.0",typescript:"^3.5.1"},dependencies:{antd:"^3.19.2",classnames:"^2.2.6","electron-better-dialog":"^1.0.6","electron-dl":"^1.14.0","electron-json-storage":"^4.1.6","electron-log":"^3.0.6","electron-window-state":"^5.0.3","face-api.js":"^0.20.0","fs-extra":"^8.0.1",ip:"^1.1.5",lodash:"^4.17.11",mobx:"^5.9.4","mobx-react":"^6.0.2","mobx-react-devtools":"6.1.1","mobx-react-router":"^4.0.7","node-pty":"0.9.0-beta13","object-hash":"^1.3.1",react:"^16.8.6","react-dom":"^16.8.6","react-router":"5.0.0","react-router-dom":"5.0.0",tslib:"^1.9.3",uuid:"^3.3.2",xterm:"^3.14.1",yaml:"^1.6.0"}};
},{}],"core/bridge.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("electron"),t=w(require("../utils/file")),o=w(require("../utils/readTxtByLine")),n=w(require("electron-log")),r=v(require("electron-json-storage")),i=v(require("ip")),a=v(require("os")),s=v(require("object-hash")),u=v(require("../utils/crypto")),d=w(require("../utils/tray")),c=w(require("./winCreate")),l=require("electron-better-dialog"),f=w(require("electron-dl")),p=v(require("uuid")),g=require("../utils/env");function v(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,o):{};n.get||n.set?Object.defineProperty(t,o,n):t[o]=e[o]}return t.default=e,t}function w(e){return e&&e.__esModule?e:{default:e}}var m=require("../../../package.json"),x=function(v){var w,x=v.dispatch,h=v.win,y={},b=null;return h&&((b=(0,d.default)(v)).setToolTip("Altas "+m.version),v.on("read-app-info",function(){x("get-app-info",m)}),v.on("set-tray-title",function(e){b.setTitle(e)}),b.on("click",function(){h.isVisible()?h.hide():h.show()})),v.on("get-appdir",function(){x("appdir",{root:t.default.root})}),v.on("write-storage",function(e){var t=e.key,o=e.data;r.set(t,o,function(e){if(e)throw e;n.default.info(o),n.default.info("[".concat(t,"]：数据已写入"))})}),v.on("read-storage",function(e){r.get(e,function(e,t){x("get-storage",t)})}),v.on("remove-storage",function(e){r.remove(e,function(e){n.default.error(e)}),n.default.info("[".concat(e,"]：数据已删除"))}),v.on("on-dialog-message",function(e){h&&(0,l.showBetterMessageBox)(h,e)}),v.on("read-text",function(e){(0,o.default)(e,function(e,t){x("get-text-line",{index:e,line:t,status:"pending"})},function(){x("get-text-line",{status:"done"})})}),v.on("file-download",function(e){var t,o=e.url,r=e.args,i=function(){var e=r.timeout;e&&(t=setTimeout(function(){w&&(w.cancel(),n.default.error(o+"[下载超时，已取消]"))},e))};h&&f.default.download(h,o,Object.assign({onCancel:function(){t&&clearTimeout(t),x("on-download-state",{index:r.index||0,progress:0,status:"cancel"})},onProgress:function(e){t&&clearTimeout(t),i(),x("on-download-state",{index:r.index||0,progress:e,status:"running"})},onStarted:function(e){w=e,i(),x("on-download-state",{index:r.index||0,progress:0,status:"start"})}},r)).then(function(e){t&&clearTimeout(t),n.default.debug(e.getSavePath()),x("on-download-state",{index:r.index||0,progress:1,status:"finished"})}).catch(function(){t&&clearTimeout(t),x("on-download-state",{index:r.index||0,progress:0,status:"error"})})}),v.on("file-download-cancel",function(){w&&w.cancel()}),v.on("read-clipboard",function(){x("get-clipboard-text",e.clipboard.readText())}),v.on("write-clipboard",function(t){e.clipboard.writeText(t)}),v.on("get-ip-address",function(){var e={ip:""};e.ip=i.address(),x("ip-address",e)}),v.on("get-device-os",function(){var e={arch:a.arch(),cpu:a.cpus(),homedir:a.homedir(),hostname:a.hostname(),memory:a.totalmem(),network:a.networkInterfaces(),platform:a.platform(),release:a.release(),tmpdir:a.tmpdir(),type:a.type(),uptime:a.uptime(),userInfo:a.userInfo()};x("device-os",e)}),v.on("aes-encode",function(e){var t=s.MD5(e.pswd),o=t.slice(0,16),n=t.slice(16);x("get-aes-encode",u.aseEncode(e.data,o,n))}),v.on("aes-decode",function(e){var t=s.MD5(e.pswd),o=t.slice(0,16),n=t.slice(16);x("get-aes-decode",u.aseDecode(e.data,o,n))}),v.on("create-window",function(e){if(h){var t=(0,c.default)(e.options,e.entry,h,!0),o=p.v4();y[o]=t,x("get-window-id",{win_uid:o})}}),v.on("close-window",function(e){if(e.uid in y){var t=y[e.uid];t.isDestroyed()||t.close()}}),v.on("detect-support-env",function(e){var t=(0,g.supportEnv)();n.default.info(t),x("get-support-env",{env_support:t})}),{tray:b}};exports.default=x;
},{"../utils/file":"utils/file.ts","../utils/readTxtByLine":"utils/readTxtByLine.ts","../utils/crypto":"utils/crypto.ts","../utils/tray":"utils/tray.ts","./winCreate":"core/winCreate.ts","../utils/env":"utils/env.ts","../../../package.json":"../../package.json"}],"main.ts":[function(require,module,exports) {
"use strict";var e,r=require("electron"),t=u(require("./core/winCreate")),n=u(require("./core/rpc")),i=u(require("./core/bridge"));function u(e){return e&&e.__esModule?e:{default:e}}var a=!1,o=function(){e=(0,t.default)({height:648,width:1050,minWidth:980,minHeight:620},{pathname:"renderer/index.html",hash:""});var u=(0,n.default)(e),o=(0,i.default)(u).tray;e.on("close",function(t){a?(o.destroy(),e=null,r.app.quit()):(t.preventDefault(),e.hide())}),e.hide()};r.app.on("ready",o),r.app.on("before-quit",function(){a=!0}),r.app.on("window-all-closed",function(){"darwin"!==process.platform&&r.app.quit()}),r.app.on("activate",function(){null===e?o():e.show()}),require("./utils/env").supportEnv();
},{"./core/winCreate":"core/winCreate.ts","./core/rpc":"core/rpc.ts","./core/bridge":"core/bridge.ts","./utils/env":"utils/env.ts"}]},{},["main.ts"], null)