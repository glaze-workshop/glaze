/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { MessageGateway } from './message.gateway'

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [
    MessageGateway
  ],
  exports: [MessageGateway]
})
export class MessageModule {}
