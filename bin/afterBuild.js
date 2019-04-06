const log = require('electron-log')

exports.default = async (context) => {
  const { platform } = context.packager
  const { name, nodeName } = platform
  log.info(context.file)
  log.info(`[${nodeName}] ${name}应用安装包构建完成！`)
  process.exit(0)
}
