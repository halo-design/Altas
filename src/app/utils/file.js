const path = require('path')
const fs = require('fs-extra')
const root = path.join(__dirname, '../')

const saveFile = (filePath, fileDataBuffer) => {
  return new Promise((resolve, reject) => {
  const wstream = fs.createWriteStream(filePath)
  wstream.on('open', () => {
    const blockSize = 128;
    const nbBlocks = Math.ceil(fileDataBuffer.length / (blockSize))
    for (let i = 0; i < nbBlocks; i += 1) {
      const currentBlock = fileDataBuffer.slice(blockSize * i, Math.min(blockSize * (i + 1), fileDataBuffer.length))
      wstream.write(currentBlock)
    }
    wstream.end()
  })
  wstream.on('error', err => { reject(err) })
  wstream.on('finish', () => { resolve(true) })
  })
}

module.exports = {
  root,
  saveFile,
  path: p => path.join(root, p),
  exist: filename => fs.existsSync(path.join(root, filename)),
  del: filename => {
    const fileRelPath = path.join(root, filename)
    if (fs.existsSync(fileRelPath)) {
      fs.unlinkSync(fileRelPath)
    }
  },
  file2JSON: filePath => JSON.parse(fs.readFileSync(path.join(root, filePath))),
  JSON2File: (fileName, data) => {
    const buf = Buffer.from(JSON.stringify(data, null, 2), 'utf8')
    saveFile(fileName, buf)
  },
  saveFile
}
