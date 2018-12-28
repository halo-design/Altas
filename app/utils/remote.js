const request = require('request')
const fs = require('fs')

module.exports = {
  downloadFile (url, filename) {
    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filename)
      request(url)
        .pipe(stream)
        .on('error', reject)
        .on('close', resolve)
    })
  }
}