const log = require('electron-log')
const { getFileName, saveInfo } = require('./utils')

exports.default = async (context) => {
  const { packager, file, updateInfo } = context
  const { platform } = packager
  const { name, nodeName } = platform

  log.info(`[${nodeName}] ${name}应用安装包构建完成！`)

  if (/(mac|windows)/.test(name)) {
    const localFile = file.replace('.blockmap', '')
    const remoteFile = `www/${getFileName(localFile)}`
    let data = {}
    data[name] = { localFile, remoteFile, updateInfo }

    saveInfo(data)
  }

  process.exit(0)
}
