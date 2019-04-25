const crypto = require('crypto')

exports.aseEncode = (data, password, iv) => {
  if (password.length !== 16 || iv.length !== 16) {
    return ''
  }
  const cipher = crypto.createCipheriv('aes-128-cbc', password, iv)
  let crypted = cipher.update(data, 'utf-8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

exports.aseDecode = (data, password, iv) => {
  if (password.length !== 16 || iv.length !== 16) {
    return ''
  }
  const decipher = crypto.createDecipheriv('aes-128-cbc', password, iv)
  let decrypted = decipher.update(data, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')
  return decrypted
}
