const os = require('os');
const ptySpawn = require('node-pty').spawn;

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

if (process.platform === 'darwin') {
  process.env.PATH = process.env.PATH + ':/usr/local/bin';
}

const initPty = () => {
  return ptySpawn(shell, [], {
    name: 'xterm-color',
    cols: 60,
    rows: 32,
    cwd: process.env.PWD,
    env: process.env,
  });
};

let term: any = initPty();
let first: boolean = true;
let kill: boolean = false;

export const spawn = (command: string, bindFn: (out: string) => void) => {
  if (kill) {
    term = initPty();
    kill = false;
    first = true;
  }
  term.write(command);
  if (first) {
    term.on('data', (data: any) => {
      bindFn(data);
    });
    first = false;
  }
};

export const spawnKill = () => {
  term.kill();
  term = null;
  kill = true;
};
