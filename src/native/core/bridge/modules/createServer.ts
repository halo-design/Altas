import liveServer from '../../../utils/server';
import log from 'electron-log';

export default (RPC: any) => {
  const { dispatch } = RPC;
  let serverStarted: boolean = false;

  RPC.on('create-server', (args: any) => {
    if (serverStarted) {
      return;
    }
    serverStarted = true;
    const { options } = args;
    const middleware: any[] = [];

    const logger = (req: any, res: any, next: any) => {
      dispatch('server-logger', { req, res });
      next();
    };

    middleware.push(logger);

    liveServer.start(
      {
        ...options,
        middleware,
      },
      (root: string, serveURLs: string[]) => {
        serverStarted = true;
        log.info('Web Server Started.');
        dispatch('server-started', { root, serveURLs });
      },
      (e: any) => {
        serverStarted = false;
        dispatch('server-error', { errorMsg: e.toString() });
        log.info('Web Server Error.');
      }
    );
  });

  RPC.on('close-server', () => {
    liveServer.shutdown();
    serverStarted = false;
    log.info('Web Server Shutdown.');
    dispatch('server-closed', '');
  });
};
