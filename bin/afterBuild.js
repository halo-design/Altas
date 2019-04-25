const path = require('path')
const log = require('electron-log')
const { saveInfo } = require('./utils')

exports.default = async (context) => {
  const { packager, file, updateInfo } = context
  const { platform } = packager
  const { name, nodeName } = platform

  log.info(`[${nodeName}] ${name}应用安装包构建完成！`)

  if (/(mac|windows)/.test(name)) {
    const local = file.replace('.blockmap', '')
    const basename = path.basename(local)
    const remote = `www/${basename}`
    let data = {}
    data[name] = { basename, local, remote, updateInfo }

    saveInfo(data)
  }

  process.exit(0)
}
