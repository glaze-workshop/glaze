import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule],
  controllers: [
    AuthController],
  providers: [
    AuthService]
})
export class AuthModule {}
