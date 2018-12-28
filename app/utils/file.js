const path = require('path')
const fs = require('fs-extra')
const root = path.join(__dirname, '../')

module.exports = {
  root,
  path: p => path.join(root, p),
  exist: filename => fs.existsSync(path.join(root, filename)),
  del: filename => fs.unlinkSync(path.join(root, filename)),
  file2JSON: filePath => JSON.parse(fs.readFileSync(path.join(root, filePath))),
  JSON2File: (fileName, data) => fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8')
}
