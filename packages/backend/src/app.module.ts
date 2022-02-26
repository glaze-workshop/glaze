import { TeamModule } from './team/team.module'
import { UserModule } from './user/user.module'
import { GlobalModule } from './global/global.module'
import { APP_FILTER } from '@nestjs/core'
import { AllExceptionsFilter } from './exception.filter'
import { AuthModule } from './auth/auth.module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
@Module({
  imports: [
    ConfigModule.forRoot(),
    TeamModule,
    UserModule,
    GlobalModule,
    AuthModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    AppService]
})
export class AppModule {}
