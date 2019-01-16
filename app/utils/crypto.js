const crypto = require('crypto')

exports.aseEncode = (data, password, iv) => {
  const cipher = crypto.createCipheriv('aes-128-cbc', password, iv)
  let crypted = cipher.update(data, 'utf-8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

exports.aseDecode = (data, password, iv) => {
  const decipher = crypto.createDecipheriv('aes-128-cbc', password, iv)
  let decrypted = decipher.update(data, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')
  return decrypted
}
