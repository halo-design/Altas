const log = require('electron-log')
const node_ssh = require('node-ssh')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

exports.buildInfoFilePath = path.join(__dirname, '../packages', `build-info.json`)

exports.saveInfo = data => {
  const infoFilePath = exports.buildInfoFilePath
  const hasInfoFile = fs.existsSync(infoFilePath)

  if (hasInfoFile) {
    const oldData = JSON.parse(fs.readFileSync(infoFilePath))
    fs.writeFileSync(infoFilePath, JSON.stringify(_.merge(oldData, data), null, 2))
  } else {
    fs.writeFileSync(infoFilePath, JSON.stringify(data, null, 2))
  }
}

exports.ssh = (auth, files) => {
  const ssh = new node_ssh()
  return new Promise((resolve, reject) => {
    log.warn(`准备传输文件...`)
    ssh.connect(auth).then(() => {
      log.info('已连接到服务器，正在传输文件...\n')
      ssh.putFiles(files).then(() => {
        resolve()
      }, (error) => {
        reject(error)
      })
    })
  })
}