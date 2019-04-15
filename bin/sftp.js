const log = require('electron-log')
const { buildInfoFilePath, ssh } = require('./utils')
const fs = require('fs-extra')
const path = require('path')

const auth = {
  host: '106.14.138.86',
  username: 'zyh',
  port: 22,
  password: fs.readFileSync(path.join(__dirname, '../', 'sftpkey'), 'utf-8')
}

const platform = process.argv.slice(2)[1]
let flag = 0
const whenQuit = () => {
  if (flag === 0) {
    log.warn('文件全部传输结束！')
    process.exit(0)
  }
}

if (fs.existsSync(buildInfoFilePath)) {
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoFilePath))

  if ('windows' in buildInfo && /(win|all)/.test(platform)) {
    flag++
    const { localFile, remoteFile } = buildInfo.windows
    ssh(auth, localFile, remoteFile).then(() => {
      log.info(`文件传输成功！`)
      flag--
      whenQuit()
    }).catch(err => {
      log.warn(err)
      flag--
      whenQuit()
    })
  }

  if ('mac' in buildInfo && /(mac|all)/.test(platform)) {
    flag++
    const { localFile, remoteFile } = buildInfo.mac
    ssh(auth, localFile, remoteFile).then(() => {
      log.info(`文件传输成功！`)
      flag--
      whenQuit()
    }).catch(err => {
      log.warn(err)
      flag--
      whenQuit()
    })
  }

} else {
  log.error('未找到构建信息文件！')
}
