import CryptoJS from 'crypto-js'

export function encrypt(v: string, secret: string) {
  return CryptoJS.AES.encrypt(v, secret).toString()
}

export function decrypt(v: string, secret: string) {
  const bytes = CryptoJS.AES.decrypt(v, secret)
  return bytes.toString(CryptoJS.enc.Utf8)
}
