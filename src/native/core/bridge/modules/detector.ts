import * as os from 'os';
import * as ip from 'ip';
import * as path from 'path';
import * as si from 'systeminformation';
import file from '../../../utils/file';
import projectRunner from '../../../utils/projectRunner';
import { cmdIsAvailable, langIsAvailable } from '../../../utils/env';

export default (RPC: any) => {
  const { dispatch } = RPC;

  RPC.on('get-appdir', () => {
    dispatch('appdir', { root: file.root });
  });

  RPC.on('detect-support-env', (args: any) => {
    const es = [
      {
        name: 'Node.js',
        icon_name: 'node',
        version: cmdIsAvailable('node -v'),
        download_lnk: 'http://nodejs.cn/download/',
      },
      {
        name: 'NPM',
        icon_name: 'npm',
        version: cmdIsAvailable('npm -v'),
        download_lnk: 'http://caibaojian.com/npm/all.html',
      },
      {
        icon_name: 'vue',
        name: 'Vue CLI',
        version: cmdIsAvailable('vue -V'),
        download_lnk: 'https://cli.vuejs.org/zh/guide/prototyping.html',
      },
      {
        icon_name: 'yarn',
        name: 'Yarn',
        version: cmdIsAvailable('yarn -v'),
        download_lnk: 'https://yarn.bootcss.com/docs/install/',
      },
      {
        name: 'Python',
        icon_name: 'python',
        version: langIsAvailable('python', ['-V']),
        download_lnk: 'https://www.python.org/getit/',
      },
    ];

    dispatch('get-support-env', { env_support: es });
  });

  RPC.on('detect-runner-config', (args: any) => {
    const { projectPath } = args;
    if (projectPath) {
      const config = projectRunner(projectPath);
      dispatch('get-runner-config', config);
    }
  });

  RPC.on('detect-process-pid', (args: any) => {
    if (os.platform() === 'darwin') {
      const exec = require('child_process').exec;
      exec('ps -ax | grep node', (err: any, stdout: string) => {
        if (err) {
          return;
        }
        const pidList: string[] = [];
        stdout.split('\n').filter((line: string) => {
          if (line.indexOf(path.basename(args.dirname)) >= 0) {
            const col = line.trim().split(/\s+/);
            pidList.push(col[0]);
          }
        });
        dispatch('get-process-pid', { pidList });
      });
    }
  });

  RPC.on('get-ip-address', () => {
    const network = {
      ip: '',
    };
    network.ip = ip.address();
    dispatch('ip-address', network);
  });

  RPC.on('get-device-os', () => {
    const deviceInfo = {
      arch: os.arch(),
      homedir: os.homedir(),
      hostname: os.hostname(),
      network: os.networkInterfaces(),
      platform: os.platform(),
      release: os.release(),
      tmpdir: os.tmpdir(),
      type: os.type(),
      uptime: os.uptime(),
      userInfo: os.userInfo(),
    };

    Promise.all([si.cpu(), si.graphics()]).then(([cpu, graphics]: any[]) => {
      deviceInfo['cpu'] = cpu;
      deviceInfo['graphics'] = graphics;
      dispatch('device-os', deviceInfo);
    });
  });

  RPC.on('get-device-status', () => {
    const hardware = {};

    si.mem().then((mem: any) => {
      hardware['mem'] = mem;
      dispatch('device-status', hardware);
    });
  });
};
