import { SelfController } from './self.controller'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { AuthModule } from '../auth/auth.module'
import { TeamModule } from '../team/team.module'
import { ProjectModule } from '../project/project.module'

@Module({
  imports: [
    TeamModule,
    UserModule,
    AuthModule,
    ProjectModule
  ],
  controllers: [
    SelfController]
})
export class SelfModule {}
