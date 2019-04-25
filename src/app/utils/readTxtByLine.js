const fs = require('fs')
const readline = require('readline')
const log = require('electron-log')

module.exports = (filePath, cb, done) => {
  log.debug(filePath)
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath)
  })
  
  let i = 1
  rl.on('line', line => {
    cb(i, line)
    i ++
  })

  rl.on('close', done)
}
