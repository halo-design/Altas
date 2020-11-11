import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import * as http from 'http';
import * as os from 'os';
import log from 'electron-log';
import file from '../utils/file';

const connect = require('connect');
const WebSocket = require('faye-websocket');
const logger = require('morgan');
const serveIndex = require('serve-index');
const send = require('send');
const es = require('event-stream');
const open = require('open');
const chokidar = require('chokidar');

const INJECTED_CODE = fs.readFileSync(
  file.path('renderer/public/html/injected.html'),
  'utf8'
);

const LiveServer: any = {
  server: null,
  watcher: null,
  logLevel: 2,
};

const escape = (html: string) =>
  String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const staticServer = (root: string) => {
  let isFile = false;
  try {
    isFile = fs.statSync(root).isFile();
  } catch (e) {
    if (e.code !== 'ENOENT') {
      log.error(e);
    }
  }
  return (req: any, res: any, next: (e?: any) => void) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }
    const reqpath = isFile ? '' : url.parse(req.url).pathname;
    const hasNoOrigin = !req.headers.origin;
    const injectCandidates = [
      new RegExp('</body>', 'i'),
      new RegExp('</svg>'),
      new RegExp('</head>', 'i'),
    ];
    let injectTag: any = null;

    const directory = () => {
      const pathname = url.parse(req.originalUrl).pathname;
      res.statusCode = 301;
      res.setHeader('Location', pathname + '/');
      if (pathname) {
        res.end('Redirecting to ' + escape(pathname) + '/');
      }
    };

    const file = (filepath: string) => {
      const x = path.extname(filepath).toLocaleLowerCase();
      let match: any;
      const possibleExtensions = [
        '',
        '.html',
        '.htm',
        '.xhtml',
        '.php',
        '.svg',
      ];
      if (hasNoOrigin && possibleExtensions.indexOf(x) > -1) {
        const contents = fs.readFileSync(filepath, 'utf8');
        for (let i = 0; i < injectCandidates.length; ++i) {
          match = injectCandidates[i].exec(contents);
          if (match) {
            injectTag = match[0];
            break;
          }
        }
        if (injectTag === null && LiveServer.logLevel >= 3) {
          log.warn(
            'Failed to inject refresh script!',
            "Couldn't find any of the tags ",
            injectCandidates,
            'from',
            filepath
          );
        }
      }
    };

    const error = (err: any) => {
      if (err.status === 404) return next();
      next(err);
    };

    const inject = (stream: any) => {
      if (injectTag) {
        const len = INJECTED_CODE.length + res.getHeader('Content-Length');
        res.setHeader('Content-Length', len);
        const originalPipe = stream.pipe;
        stream.pipe = (resp: any) => {
          originalPipe
            .call(
              stream,
              es.replace(new RegExp(injectTag, 'i'), INJECTED_CODE + injectTag)
            )
            .pipe(resp);
        };
      }
    };

    if (reqpath) {
      send(req, reqpath, { root: root })
        .on('error', error)
        .on('directory', directory)
        .on('file', file)
        .on('stream', inject)
        .pipe(res);
    }
  };
};

const entryPoint = (
  staticHandler: (req: any, res: any, next: any) => void,
  file: any
) => {
  if (!file)
    return (req: any, res: any, next: () => void) => {
      next();
    };

  return (req: any, res: any, next: () => void) => {
    req.url = '/' + file;
    staticHandler(req, res, next);
  };
};

/**
 * Start a live server with parameters given as an object
 * @param host {string} Address to bind to (default: 0.0.0.0)
 * @param port {number} Port number (default: 8080)
 * @param root {string} Path to root directory (default: cwd)
 * @param watch {array} Paths to exclusively watch for changes
 * @param ignore {array} Paths to ignore when watching files for changes
 * @param ignorePattern {regexp} Ignore files by RegExp
 * @param noCssInject Don't inject CSS changes, just reload as with any other file change
 * @param open {(string|string[])} Subpath(s) to open in browser, use false to suppress launch (default: server root)
 * @param mount {array} Mount directories onto a route, e.g. [['/components', './node_modules']].
 * @param logLevel {number} 0 = errors only, 1 = some, 2 = lots
 * @param file {string} Path to the entry point file
 * @param wait {number} Server will wait for all changes, before reloading
 * @param htpasswd {string} Path to htpasswd file to enable HTTP Basic authentication
 * @param middleware {array} Append middleware to stack, e.g. [function(req, res, next) { next(); }].
 */

interface IServer {
  host: string;
  port: number;
  root: string;
  watch: string[];
  ignore: string[];
  ignorePattern: any;
  noCssInject: boolean;
  open: boolean;
  mount: any[];
  logLevel: number;
  file: string;
  wait: number;
  htpasswd: string;
  middleware: any[];
  noBrowser: boolean | undefined;
  browser: any;
  cors: boolean;
  https: any;
  proxy: any[] | undefined;
  httpsModule: string;
  spa: boolean;
}

LiveServer.start = (
  options: IServer,
  successFn?: (e: any, url: string[]) => void,
  errorFn?: (e: any) => void
) => {
  options = options || {};
  const host = options.host || '0.0.0.0';
  const port = options.port !== undefined ? options.port : 8080; // 0 means random
  const root = options.root || process.cwd();
  const mount = options.mount || [];
  const watchPaths = options.watch || [root];
  LiveServer.logLevel = options.logLevel === undefined ? 2 : options.logLevel;

  let openPath: any =
    options.open === undefined || options.open === true
      ? ''
      : options.open === null || options.open === false
      ? null
      : options.open;

  if (options.noBrowser) openPath = null; // Backwards compatibility with 0.7.0
  const file = options.file;
  const staticServerHandler = staticServer(root);
  const wait = options.wait === undefined ? 100 : options.wait;
  const browser = options.browser || null;
  const htpasswd = options.htpasswd || null;
  const cors = options.cors || false;
  const https = options.https || null;
  const proxy = options.proxy || [];
  const middleware = options.middleware || [];
  const noCssInject = options.noCssInject;
  let httpsModule = options.httpsModule;

  if (httpsModule) {
    try {
      require.resolve(httpsModule);
    } catch (e) {
      log.error(
        'HTTPS module "' + httpsModule + '" you\'ve provided was not found.'
      );
      log.error('Did you do', '"npm install ' + httpsModule + '"?');
      return;
    }
  } else {
    httpsModule = 'https';
  }

  const app: any = connect();

  if (LiveServer.logLevel === 2) {
    app.use(
      logger('dev', {
        skip: (req: any, res: any) => res.statusCode < 400,
      })
    );
  } else if (LiveServer.logLevel > 2) {
    app.use(logger('dev'));
  }
  if (options.spa) {
    middleware.push('spa');
  }

  middleware.map((mw: any) => {
    if (typeof mw === 'string') {
      const ext = path.extname(mw).toLocaleLowerCase();
      if (ext !== '.js') {
        mw = require(path.join(__dirname, 'middleware', mw + '.js'));
      } else {
        mw = require(mw);
      }
    }
    app.use(mw);
  });

  if (htpasswd !== null) {
    const auth = require('http-auth');
    const basic = auth.basic({
      realm: 'Please authorize',
      file: htpasswd,
    });
    app.use(auth.connect(basic));
  }
  if (cors) {
    app.use(
      require('cors')({
        origin: true,
        credentials: true,
      })
    );
  }
  mount.forEach((mountRule: any) => {
    const mountPath = path.resolve(process.cwd(), mountRule[1]);
    if (!options.watch) {
      watchPaths.push(mountPath);
    }
    app.use(mountRule[0], staticServer(mountPath));
    if (LiveServer.logLevel >= 1)
      log.info('Mapping %s to "%s"', mountRule[0], mountPath);
  });
  Object.keys(proxy).forEach((context: string) => {
    let options = proxy[context];
    if (typeof options === 'string') {
      options = { target: options };
    }
    log.info('Mapping %s to "%s"', context, options.target);
    app.use(
      require('http-proxy-middleware')(options.filter || context, options)
    );
  });

  app
    .use(staticServerHandler)
    .use(entryPoint(staticServerHandler, file))
    .use(serveIndex(root, { icons: true }));

  let server: any;
  let protocol: any;
  if (https !== null) {
    let httpsConfig = https;
    if (typeof https === 'string') {
      httpsConfig = require(path.resolve(process.cwd(), https));
    }
    server = require(httpsModule).createServer(httpsConfig, app);
    protocol = 'https';
  } else {
    server = http.createServer(app);
    protocol = 'http';
  }

  server.addListener('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      const serveURL = protocol + '://' + host + ':' + port;
      log.info('%s is already in use. Trying another port.', serveURL);
      setTimeout(() => {
        server.listen(0, host);
      }, 1000);
    } else {
      log.error(e.toString());
      LiveServer.shutdown();
      errorFn && errorFn(e);
    }
  });

  server.addListener('listening', () => {
    LiveServer.server = server;

    const address = server.address();
    const serveHost =
      address.address === '0.0.0.0' ? '127.0.0.1' : address.address;
    const openHost = host === '0.0.0.0' ? '127.0.0.1' : host;

    const serveURL = protocol + '://' + serveHost + ':' + address.port;
    const openURL = protocol + '://' + openHost + ':' + address.port;

    let serveURLs = [serveURL];
    if (LiveServer.logLevel > 2 && address.address === '0.0.0.0') {
      const ifaces: any = os.networkInterfaces();
      serveURLs = Object.keys(ifaces)
        .map((iface: any) => ifaces[iface])
        .reduce((data, addresses) => {
          addresses
            .filter((addr: any) => {
              return addr.family === 'IPv4';
            })
            .forEach((addr: any) => {
              data.push(addr);
            });
          return data;
        }, [])
        .map(
          (addr: any) => protocol + '://' + addr.address + ':' + address.port
        );
    }

    if (LiveServer.logLevel >= 1) {
      if (serveURL === openURL)
        if (serveURLs.length === 1) {
          log.info('Serving "%s" at %s', root, serveURLs[0]);
        } else {
          log.info('Serving "%s" at\n\t%s', root, serveURLs.join('\n\t'));
        }
      else {
        log.info('Serving "%s" at %s (%s)', root, openURL, serveURL);
      }
      successFn && successFn(root, serveURLs);
    }

    if (openPath !== null)
      if (typeof openPath === 'object') {
        openPath.forEach((p: any) => {
          open(openURL + p, { app: browser });
        });
      } else {
        open(openURL + openPath, { app: browser });
      }
  });

  server.listen(port, host);

  let clients: any[] = [];
  server.addListener('upgrade', (request: any, socket: any, head: any) => {
    const ws = new WebSocket(request, socket, head);
    ws.onopen = () => {
      ws.send('connected');
    };

    if (wait > 0) {
      // eslint-disable-next-line prettier/prettier
      (function() {
        const wssend = ws.send;
        let waitTimeout: any;
        ws.send = () => {
          // eslint-disable-next-line prefer-rest-params
          const args = arguments;
          if (waitTimeout) clearTimeout(waitTimeout);
          waitTimeout = setTimeout(() => {
            wssend.apply(ws, args);
          }, wait);
        };
      })();
    }

    ws.onclose = () => {
      clients = clients.filter((x: any) => {
        return x !== ws;
      });
    };

    clients.push(ws);
  });

  let ignored: any = [
    (testPath: string) =>
      testPath !== '.' && /(^[.#]|(?:__|~)$)/.test(path.basename(testPath)),
  ];
  if (options.ignore) {
    ignored = ignored.concat(options.ignore);
  }
  if (options.ignorePattern) {
    ignored.push(options.ignorePattern);
  }

  LiveServer.watcher = chokidar.watch(watchPaths, {
    ignored: ignored,
    ignoreInitial: true,
  });

  const handleChange = (changePath: string) => {
    const cssChange = path.extname(changePath) === '.css' && !noCssInject;
    if (LiveServer.logLevel >= 1) {
      if (cssChange) {
        log.info('CSS change detected', changePath);
      } else {
        log.info('Change detected', changePath);
      }
    }
    clients.forEach((ws: any) => {
      if (ws) {
        ws.send(cssChange ? 'refreshcss' : 'reload');
      }
    });
  };

  LiveServer.watcher
    .on('change', handleChange)
    .on('add', handleChange)
    .on('unlink', handleChange)
    .on('addDir', handleChange)
    .on('unlinkDir', handleChange)
    .on('ready', () => {
      if (LiveServer.logLevel >= 1) {
        log.info('Ready for changes');
      }
    })
    .on('error', (err: any) => {
      log.info('ERROR:', err);
    });

  return server;
};

LiveServer.shutdown = () => {
  const watcher = LiveServer.watcher;
  if (watcher) {
    watcher.close();
  }
  const server = LiveServer.server;
  if (server) {
    server.close();
  }
};

export default LiveServer;
