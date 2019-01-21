const fs = require('fs-extra')
const path = require('path')

fs.emptyDirSync(path.join(__dirname, '../', process.argv.slice(2)[1]))
