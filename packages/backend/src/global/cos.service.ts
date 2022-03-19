/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import COS from 'cos-nodejs-sdk-v5'
import STS from 'qcloud-cos-sts'

@Injectable()
export class CosService {
  private readonly cosClient: COS

  private readonly secretId: string
  private readonly secretKey: string
  private readonly bucket: string
  private readonly region: string

  constructor (private configService: ConfigService) {
    this.secretId = this.configService.get('TENCENT_SECRET_ID') !
    this.secretKey = this.configService.get('TENCENT_SECRET_KEY') !
    this.bucket = this.configService.get('TENCENT_BUCKET') !
    this.region = this.configService.get('TENCENT_REGION') !

    this.cosClient = new COS({
      SecretId: this.secretId,
      SecretKey: this.secretKey
    })
  }

  uploadImage (image: Buffer, path: string): Promise<COS.PutObjectResult> {
    return this.cosClient.putObject({
      Bucket: this.bucket,
      Region: this.region,
      Key: path,
      Body: image
    })
  }

  getUploadCredential () {
    const policy = STS.getPolicy([{
      action: [
        // 简单上传操作
        'name/cos:PutObject',
        // 表单上传对象
        'name/cos:PostObject',
        // 分块上传：初始化分块操作
        'name/cos:InitiateMultipartUpload',
        // 分块上传：List 进行中的分块上传
        'name/cos:ListMultipartUploads',
        // 分块上传：List 已上传分块操作
        'name/cos:ListParts',
        // 分块上传：上传分块块操作
        'name/cos:UploadPart',
        // 分块上传：完成所有分块上传操作
        'name/cos:CompleteMultipartUpload',
        // 取消分块上传操作
        'name/cos:AbortMultipartUpload'
      ],
      region: this.region,
      bucket: this.bucket,
      prefix: 'user/*'
    }])
    return STS.getCredential({
      secretId: this.secretId,
      secretKey: this.secretKey,
      policy
    })
  }
}
