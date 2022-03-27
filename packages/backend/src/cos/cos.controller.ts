/*
https://docs.nestjs.com/controllers#controllers
*/

import { CosApi, Prefix } from '@glaze/common'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../auth/jwt.guard'
import { CosService } from './cos.service'

@Controller(Prefix.COS_PREFIX)
export class CosController {
  constructor (private cosService: CosService) {
  }

  @UseGuards(JwtGuard)
  @Get(CosApi.COS_CREDENTIAL_PATH)
  getUploadCredential () {
    return this.cosService.getUploadCredential()
  }

  @UseGuards(JwtGuard)
  @Get(CosApi.COS_BASIC_INFO_PATH)
  getBasicInfo () {
    return this.cosService.getBasicInfo()
  }
}
