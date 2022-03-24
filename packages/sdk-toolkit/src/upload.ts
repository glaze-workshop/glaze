import { CosApi } from '@glaze/common'
import axios from 'axios'
import COS from 'cos-nodejs-sdk-v5'

const cosClient = new COS({
  getAuthorization(params, callback) {
    CosApi.getUploadCredential().then(({ data }) => {
      const { credentials } = data
      callback({
        TmpSecretId: credentials.tmpSecretId, // 临时密钥的 tmpSecretId
        TmpSecretKey: credentials.tmpSecretKey, // 临时密钥的 tmpSecretKey
        SecurityToken: credentials.sessionToken, // 临时密钥的 sessionToken
        ExpiredTime: data.expiredTime, // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
        StartTime: data.startTime
      })
    })
  }
})

export interface UploadInfo {
  /** 本地文件地址 */
  filePath: string

  /** 上传的目标地址 */
  key: string
}

export const uploadFiles = async (
  infos: UploadInfo[]
): Promise<COS.UploadFilesResult> => {
  const { data } = await CosApi.getCosBasicInfo()
  return cosClient.uploadFiles({
    files: infos.map(info => ({
      FilePath: info.filePath,
      Key: info.key,
      Bucket: data.bucket,
      Region: data.region
    }))
  })
}
