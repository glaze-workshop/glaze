import { UserController } from './user.controller'
import { UserService } from './user.service'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { TeamModule } from '../team/team.module'

@Module({
  imports: [TeamModule],
  controllers: [
    UserController],
  providers: [
    UserService],
  exports: [UserService]
})
export class UserModule {}
