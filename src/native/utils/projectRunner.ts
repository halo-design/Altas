import * as fs from 'fs-extra';
import * as path from 'path';
const readYaml = require('read-yaml');
import { cmdIsAvailable, isMac } from '../utils/env';
import log from 'electron-log';

const hasYarn = cmdIsAvailable('yarn -v');

export default (projectPath: string) => {
  const projectIsExists = fs.existsSync(projectPath);

  if (projectIsExists) {
    const configPath = path.join(projectPath, 'altas.yml');
    const isConfigExists = fs.existsSync(configPath);
    const isNodeModulesExists = fs.existsSync(
      path.join(projectPath, 'node_modules')
    );

    const commander = hasYarn ? 'yarn ' : 'npm ';
    const sudo = isMac() ? 'sudo ' : '';
    const commandLine = sudo + commander + 'install';
    const commandConfig = {
      name: '安装npm依赖包',
      shell: commandLine,
      needCancel: false,
    };

    if (isConfigExists) {
      const config = readYaml.sync(configPath);

      const cheetahDirNames: object = {};
      const cheetahRootDir: string = path.join(
        projectPath,
        config['modules'] || 'src/modules'
      );
      const ischeetahRootDirExists = fs.existsSync(cheetahRootDir);

      if (config.type === 'cheetah' && ischeetahRootDirExists) {
        const deepReadDir = (filepath: string, injecter: Object) => {
          const files = fs.readdirSync(filepath);

          files.forEach((filename: string) => {
            const fileDir = path.join(filepath, filename);
            const result = fs.statSync(fileDir);

            if (result && result.isDirectory()) {
              injecter[filename] = {};
              deepReadDir(fileDir, injecter[filename]);
            }
          });
        };

        deepReadDir(cheetahRootDir, cheetahDirNames);
        log.info('完成对猎豹工程目录的扫描.');
        config['cheetahProject'] = cheetahDirNames;
      }

      if (!isNodeModulesExists) {
        config.command.unshift(commandConfig);
      }

      const result = {
        noProject: false,
        noConfig: false,
        configList: config,
      };
      return result;
    } else {
      return {
        noProject: false,
        noConfig: true,
        configList: {
          type: 'web',
          command: [],
        },
      };
    }
  } else {
    return {
      noProject: true,
      noConfig: true,
      configList: {
        type: 'web',
        command: [],
      },
    };
  }
};
