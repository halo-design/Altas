const log = require('electron-log')
const { buildInfoFilePath, ssh } = require('./utils')
const fs = require('fs-extra')
const path = require('path')
const yaml = require('yaml')

const auth = yaml.parse(fs.readFileSync(path.join(__dirname, '../keygen.yml'), 'utf-8'))

const platform = process.argv.slice(2)[1]
const uploadArr = []

if (fs.existsSync(buildInfoFilePath)) {
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoFilePath))

  if ('windows' in buildInfo && /(win|all)/.test(platform)) {
    const { local, remote } = buildInfo.windows
    uploadArr.push({ local, remote })
  }

  if ('mac' in buildInfo && /(mac|all)/.test(platform)) {
    const { local, remote } = buildInfo.windows
    uploadArr.push({ local, remote })
  }

  ssh(auth, uploadArr).then(() => {
    log.info(`文件传输成功！`)
    process.exit(0)
  }).catch(err => {
    log.warn(err)
    process.exit(0)
  })

} else {
  log.error('未找到构建信息文件！')
}
