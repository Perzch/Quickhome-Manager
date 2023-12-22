
import JSEncrypt from 'jsencrypt'
const encryptor = new JSEncrypt()
encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----${import.meta.env.VITE_ENCRYPT_PUBLIC_KEY}-----END PUBLIC KEY-----`)
encryptor.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----${import.meta.env.VITE_ENCRYPT_PRIVATE_KEY}-----END RSA PRIVATE KEY-----`)
/**
 * 加密
 * @param str 需要加密的字符串
 */
export const encrypt = (str) => {
    return encryptor.encrypt(str).toString()
}
/**
 * 解密
 * @param str 需要解密的字符串
 */
export const decrypt = (str) => {
    return encryptor.decrypt(str).toString()
}
