const log = require('electron-log')
const node_ssh = require('node-ssh')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const ora = require('ora')

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
  const spinner = ora('准备开始上传...\n').start()

  const ssh = new node_ssh()
  return new Promise(async (resolve, reject) => {
    spinner.text = '连接到服务器...'
    await ssh.connect(auth)
    spinner.text = '开始传输文件...'
    ssh.putFiles(files)
      .then(() => {
        spinner.succeed(`共${files.length}个文件传输完毕！`)
        resolve()
      }).catch((error) => {
        spinner.fail('文件传输失败！')
        reject(error)
      })
  })
}