const { execSync, spawnSync } = require('child_process');

export const cmdIsAvailable = (cmd: string) => {
  try {
    const outBuffer = execSync(cmd, { stdio: 'pipe' });
    return outBuffer.toString('utf8').replace(/\n/g, '');
  } catch (e) {
    return false;
  }
};

export const langIsAvailable = (cmd: string, argArr: string[]) => {
  try {
    const out = spawnSync(cmd, argArr, { stdio: 'pipe' });
    return out.stderr.toString('utf8').replace(/\n/g, '');
  } catch (e) {
    return false;
  }
};

export const supportEnv = () => {
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

  return es;
};
