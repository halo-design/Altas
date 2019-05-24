process.env.HMR_PORT=0;process.env.HMR_HOSTNAME="localhost";parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"utils/file.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("fs-extra")),r=t(require("path"));function t(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};n.get||n.set?Object.defineProperty(r,t,n):r[t]=e[t]}return r.default=e,r}var n=r.join(__dirname,"../"),i=function(r,t){return new Promise(function(n,i){var o=e.createWriteStream(r);o.on("open",function(){for(var e=Math.ceil(t.length/128),r=0;r<e;r+=1){var n=t.slice(128*r,Math.min(128*(r+1),t.length));o.write(n)}o.end()}),o.on("error",function(e){i(e)}),o.on("finish",function(){n(!0)})})},o={JSON2File:function(e,r){var t=Buffer.from(JSON.stringify(r,null,2),"utf8");i(e,t)},del:function(t){var i=r.join(n,t);e.existsSync(i)&&e.unlinkSync(i)},exist:function(t){return e.existsSync(r.join(n,t))},file2JSON:function(t){return JSON.parse(e.readFileSync(r.join(n,t),"utf-8"))},path:function(e){return r.join(n,e)},root:n,saveFile:i};exports.default=o;
},{}],"createWindow.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("electron"),r=a(require("url")),t=o(require("./utils/file"));function o(e){return e&&e.__esModule?e:{default:e}}function a(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var o=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};o.get||o.set?Object.defineProperty(r,t,o):r[t]=e[t]}return r.default=e,r}var n=require("electron-window-state"),i={appName:"Altas",version:"0.2.4"},l="darwin"===process.platform,u=function(o){var a=o.entry,u=o.width,c=o.height,d=o.bridge,s=n({defaultHeight:c,defaultWidth:u}),f={appIcon:t.default.path("resources/dock.png"),center:!0,frame:!1,fullscreenable:!1,height:s.height,icon:t.default.path("resources/dock.ico"),titleBarStyle:"hidden",transparent:!1,webPreferences:{nodeIntegration:!0,scrollBounce:!0},width:s.width,x:s.x,y:s.y};l?f.vibrancy="appearance-based":f.backgroundColor="#fff";var p=new e.BrowserWindow(f);s.manage(p);var h=r.format({pathname:t.default.path(a),protocol:"file:",slashes:!0});return p.loadURL(h),p.on("closed",function(){p=null}),d(p,i),p},c=u;exports.default=c;
},{"./utils/file":"utils/file.ts"}],"utils/crypto.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.aseDecode=exports.aseEncode=void 0;var e=r(require("crypto"));function r(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};n.get||n.set?Object.defineProperty(r,t,n):r[t]=e[t]}return r.default=e,r}var t=function(r,t,n){if(16!==t.length||16!==n.length)return"";var o=e.createCipheriv("aes-128-cbc",t,n),c=o.update(r,"utf8","hex");return c+=o.final("hex")};exports.aseEncode=t;var n=function(r,t,n){if(16!==t.length||16!==n.length)return"";var o=e.createDecipheriv("aes-128-cbc",t,n),c=o.update(r,"hex","utf8");return c+=o.final("utf-8")};exports.aseDecode=n;
},{}],"utils/readTxtByLine.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("electron-log")),r=o(require("fs")),t=o(require("readline"));function o(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var o=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};o.get||o.set?Object.defineProperty(r,t,o):r[t]=e[t]}return r.default=e,r}function n(e){return e&&e.__esModule?e:{default:e}}var u=function(o,n,u){e.default.debug(o);var i=t.createInterface({input:r.createReadStream(o)}),a=1;i.on("line",function(e){n(a,e),a++}),i.on("close",u)};exports.default=u;
},{}],"utils/terminal.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.unbindReadStdout=exports.bindReadStdout=exports.commander=void 0;var e=require("os"),o=require("node-pty"),r="win32"===e.platform()?"powershell.exe":"bash";"darwin"===process.platform&&(process.env.PATH=process.env.PATH+":/usr/local/bin");var t=o.spawn(r,[],{name:"xterm-color",cols:60,rows:32,cwd:process.env.PWD,env:process.env}),n=function(e){t.write(e)};exports.commander=n;var s=function(e){t.on("data",function(o){e(o)})};exports.bindReadStdout=s;var a=function(){t.off("data")};exports.unbindReadStdout=a;
},{}],"utils/bridge.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=p(require("electron")),n=require("electron-better-dialog"),t=l(require("electron-dl")),o=p(require("electron-json-storage")),r=p(require("ip")),d=p(require("os")),i=p(require("object-hash")),s=l(require("electron-log")),a=p(require("./crypto")),c=l(require("./file")),u=l(require("./readTxtByLine")),f=require("./terminal");function l(e){return e&&e.__esModule?e:{default:e}}function p(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t)){var o=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,t):{};o.get||o.set?Object.defineProperty(n,t,o):n[t]=e[t]}return n.default=e,n}var g=e.ipcMain,m=e.clipboard,w=function(e,l){var p;g.on("get-appdir",function(e){e.sender.send("appdir",c.default.root)}),g.on("write-storage",function(e,n,t){o.set(n,t,function(e){if(e)throw e;s.default.info(t),s.default.info("[".concat(n,"]：数据已写入"))})}),g.on("read-storage",function(e,n){o.get(n,function(n,t){e.sender.send("get-storage",t)})}),g.on("remove-storage",function(e,n){o.remove(n,function(e){s.default.error(e)}),s.default.info("[".concat(n,"]：数据已删除"))}),g.on("on-dialog-message",function(t,o){(0,n.showBetterMessageBox)(e,o)}),g.on("ipc-start",function(e){e.sender.send("ipc-running",l)}),g.on("read-text",function(e,n){(0,u.default)(n,function(n,t){var o={index:n,line:t,status:"pending"};e.sender.send("get-text-line",o)},function(){e.sender.send("get-text-line",{status:"done"})})}),g.on("file-download",function(n,o,r){var d,i=function(){var e=r.timeout;e&&(d=setTimeout(function(){p&&(p.cancel(),s.default.error(o+"[下载超时，已取消]"))},e))};t.default.download(e,o,Object.assign({onCancel:function(n){d&&clearTimeout(d),e.webContents.send("on-download-state",{index:r.index||0,progress:0,status:"cancel"})},onProgress:function(n){d&&clearTimeout(d),i(),e.webContents.send("on-download-state",{index:r.index||0,progress:n,status:"running"})},onStarted:function(n){p=n,i(),e.webContents.send("on-download-state",{index:r.index||0,progress:0,status:"start"})}},r)).then(function(n){d&&clearTimeout(d),s.default.debug(n.getSavePath()),e.webContents.send("on-download-state",{index:r.index||0,progress:1,status:"finished"})}).catch(function(){d&&clearTimeout(d),e.webContents.send("on-download-state",{index:r.index||0,progress:0,status:"error"})})}),g.on("file-download-cancel",function(){p&&p.cancel()}),g.on("read-clipboard",function(e){e.sender.send("get-clipboard-text",m.readText())}),g.on("write-clipboard",function(e,n){m.writeText(n)}),g.on("get-ip-address",function(e){var n={ip:""};n.ip=r.address(),e.sender.send("ip-address",n)}),g.on("get-device-os",function(e){var n={arch:d.arch(),cpu:d.cpus(),homedir:d.homedir(),hostname:d.hostname(),memory:d.totalmem(),network:d.networkInterfaces(),platform:d.platform(),release:d.release(),tmpdir:d.tmpdir(),type:d.type(),uptime:d.uptime(),userInfo:d.userInfo()};e.sender.send("device-os",n)}),g.on("aes-encode",function(e,n){var t=i.MD5(n.pswd),o=t.slice(0,16),r=t.slice(16);e.sender.send("get-aes-encode",a.aseEncode(n.data,o,r))}),g.on("aes-decode",function(e,n){var t=i.MD5(n.pswd),o=t.slice(0,16),r=t.slice(16);e.sender.send("get-aes-decode",a.aseDecode(n.data,o,r))}),g.on("commander",function(e,n){(0,f.commander)(n)}),g.on("bind-read-stdout",function(e){(0,f.bindReadStdout)(function(n){e.sender.send("stdout",n)})}),g.on("unbind-read-stdout",function(){(0,f.unbindReadStdout)()})};exports.default=w;
},{"./crypto":"utils/crypto.ts","./file":"utils/file.ts","./readTxtByLine":"utils/readTxtByLine.ts","./terminal":"utils/terminal.ts"}],"utils/tray.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("electron"),t=o(require("./file"));function o(e){return e&&e.__esModule?e:{default:e}}var r="win32"===process.platform,n=function(o){var n=r?t.default.path("resources/dock.ico"):t.default.path("resources/icon.png"),l=new e.Tray(n),u=e.Menu.buildFromTemplate([{click:function(){o.webContents.send("history-push","/sync"),o.show(),o.focus()},label:"设置"},{type:"separator"},{click:function(){e.shell.openExternal("https://github.com/halo-design/Altas")},label:"关于"},{click:function(){e.app.quit()},label:"退出"}]);return l.setContextMenu(u),l};exports.default=n;
},{"./file":"utils/file.ts"}],"main.ts":[function(require,module,exports) {
"use strict";var e,t,i=require("electron"),n=u(require("./createWindow")),r=u(require("./utils/bridge")),o=u(require("./utils/tray"));function u(e){return e&&e.__esModule?e:{default:e}}var l=!1,a=function(){e=(0,n.default)({bridge:r.default,entry:"renderer/index.html",height:620,width:980}),(t=(0,o.default)(e)).setToolTip("Altas"),i.ipcMain.on("set-tray-title",function(e,i){t.setTitle(i)}),t.on("click",function(){e.isVisible()?e.hide():e.show()}),e.on("close",function(n){l?(t.destroy(),e=null,t=null,i.app.quit()):(n.preventDefault(),e.hide())}),e.hide()};i.app.on("ready",a),i.app.on("before-quit",function(){l=!0}),i.app.on("window-all-closed",function(){"darwin"!==process.platform&&i.app.quit()}),i.app.on("activate",function(){null===e?a():e.show()});
},{"./createWindow":"createWindow.ts","./utils/bridge":"utils/bridge.ts","./utils/tray":"utils/tray.ts"}]},{},["main.ts"], null)