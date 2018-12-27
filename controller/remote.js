const https = require('https')
const download = require('download-git-repo')

module.exports = {
  getRemoteJson (url) {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        const { statusCode } = res
        if (statusCode !== 200) {
          console.log('文件请求失败！')
          reject(statusCode)
          res.resume()
        } else {
          res.setEncoding('utf8')
  
          let rawData = ''
          res.on('data', chunk => {
            rawData += chunk
          })
        
          res.on('end', () => {
            resolve(JSON.parse(rawData))
          }).on('error', e => {
            reject(e)
          })
        }
      })
    })
  },

  downloadRepoZip (url, outputDir) {
    return new Promise((resolve, reject) => {
      download('direct:' + url, outputDir, err => {
        if (err) {
          console.log('更新包下载失败！')
          reject(err)
        } else {
          resolve(outputDir)
        }
      })
    })
  }
}