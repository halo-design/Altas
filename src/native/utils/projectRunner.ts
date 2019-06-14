import * as fs from 'fs-extra';
import * as path from 'path';
import log from 'electron-log';
const readYaml = require('read-yaml');
import { cmdIsAvailable } from '../utils/env';

const hasYarn = cmdIsAvailable('yarn -v');
const isMac = process.platform === 'darwin';

export default (projectPath: string) => {
  const projectIsExists = fs.existsSync(projectPath);

  if (projectIsExists) {
    const configPath = path.join(projectPath, 'altas.yml');
    const isConfigExists = fs.existsSync(configPath);
    const isNodeModulesExists = fs.existsSync(
      path.join(projectPath, 'node_modules')
    );

    const commander = hasYarn ? 'yarn ' : 'npm ';
    const sudo = isMac ? 'sudo ' : '';
    const commandLine = sudo + commander + 'install';
    const commandConfig = {
      name: '安装npm依赖包',
      shell: commandLine,
      needCancel: false,
    };

    if (isConfigExists) {
      const config = readYaml.sync(configPath);

      if (!isNodeModulesExists) {
        config.command.unshift(commandConfig);
      }

      const result = {
        noProject: false,
        noConfig: false,
        configList: config,
      };
      log.info(result);
      return result;
    } else {
      return {
        noProject: false,
        noConfig: true,
        configList: {
          command: [],
        },
      };
    }
  } else {
    return {
      noProject: true,
      noConfig: true,
      configList: {
        command: [],
      },
    };
  }
};
