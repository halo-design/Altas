const https = require('https')

module.exports = {
  getJSON (url) {
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
  }
}