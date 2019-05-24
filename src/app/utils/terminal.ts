const os = require('os');
const pty = require('node-pty');

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

if (process.platform === 'darwin') {
  process.env.PATH = process.env.PATH + ':/usr/local/bin';
}

const term = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 60,
  rows: 32,
  cwd: process.env.PWD,
  env: process.env,
});

export const commander = (command: string) => {
  term.write(command);
};

export const bindReadStdout = (callback: (out: string) => void) => {
  term.on('data', (data: any) => {
    callback(data);
  });
};

export const unbindReadStdout = () => {
  term.off('data');
};
