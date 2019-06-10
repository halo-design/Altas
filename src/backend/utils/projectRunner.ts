import * as fs from 'fs-extra';
import * as path from 'path';
import log from 'electron-log';
const readYaml = require('read-yaml');

export default (projectPath: string) => {
  const projectIsExists = fs.existsSync(projectPath);

  if (projectIsExists) {
    const configPath = path.join(projectPath, 'altas.yml');
    const isConfigExists = fs.existsSync(configPath);

    if (isConfigExists) {
      const config = readYaml.sync(configPath);
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
