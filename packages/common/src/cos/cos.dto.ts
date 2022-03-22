export interface CredentialData {
  /** 密钥的起始时间，是 UNIX 时间戳 */
  startTime: number

  /** 密钥的失效时间，是 UNIX 时间戳 */
  expiredTime: number

  /** 临时云 API 凭据 */
  credentials: {
    /** 临时密钥 Id，可用于计算签名 */
    tmpSecretId: string

    /** 临时密钥 Key，可用于计算签名 */
    tmpSecretKey: string

    /** 请求时需要用的 token 字符串，最终请求 COS API 时，需要放在 Header 的 x-cos-security-token 字段 */
    sessionToken: string
  }
}

export interface CosBasicInfo {
  bucket: string
  region: string
}
