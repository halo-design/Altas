import * as crypto from 'crypto';

export const aseEncode = (data: string, password: string, iv: string) => {
  if (password.length !== 16 || iv.length !== 16) {
    return ''
  }
  const cipher = crypto.createCipheriv('aes-128-cbc', password, iv)
  let crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export const aseDecode = (data: string, password: string, iv: string) => {
  if (password.length !== 16 || iv.length !== 16) {
    return ''
  }
  const decipher = crypto.createDecipheriv('aes-128-cbc', password, iv)
  let decrypted = decipher.update(data, 'hex', 'utf8')
  decrypted += decipher.final('utf-8')
  return decrypted
}
