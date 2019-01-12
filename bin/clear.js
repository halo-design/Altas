const fs = require('fs-extra')
const path = require('path')

fs.emptyDirSync(path.join(__dirname, '../browser/static'))
