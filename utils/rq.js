const https = require('https')
const fs = require('fs')
const request = require('request')
const progress = require('request-progress')

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
  },

  downloadFile (url, filename, onProgress) {
    return new Promise((resolve, reject) => {
      progress(request(url), {
        // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
        // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
        // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
      })
      .on('progress', state => {
        // {
        //   percent: 0.5,            // Overall percent (between 0 to 1)
        //   speed: 554732,           // The download speed in bytes/sec
        //   size: {
        //     total: 90044871,       // The total payload size in bytes
        //     transferred: 27610959  // The transferred payload size in bytes
        //   },
        //   time: {
        //     elapsed: 36.235,       // The total elapsed seconds since the start (3 decimals)
        //     remaining: 81.403      // The remaining seconds to finish (3 decimals)
        //   }
        // }

        onProgress(state)
      })
      .on('error', err => {
        reject(err)
      })
      .on('end', () => {
        resolve()
      })
      .pipe(fs.createWriteStream(filename))
    })
  }
}