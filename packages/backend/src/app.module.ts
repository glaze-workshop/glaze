import { ComponentModule } from './component/component.module'
import { PluginModule } from './plugin/plugin.module'
import { CosModule } from './cos/cos.module'
import { ScreenshotModule } from './screenshot/screenshot.module'
import { MessageModule } from './message/message.module'
import { DeploymentModule } from './deployment/deployment.module'
import { DocModule } from './doc/doc.module'
import { FolderModule } from './folder/folder.module'
import { ProjectModule } from './project/project.module'
import { SelfModule } from './self/self.module'
import { TeamModule } from './team/team.module'
import { UserModule } from './user/user.module'
import { GlobalModule } from './global/global.module'
import { APP_FILTER } from '@nestjs/core'
import { AllExceptionsFilter } from './exception.filter'
import { AuthModule } from './auth/auth.module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype['toJSON'] = function () {
  return this.toString()
}
@Module({
  imports: [
    ComponentModule,

    PluginModule,
    ScreenshotModule,
    MessageModule,
    DeploymentModule,
    DocModule,
    FolderModule,
    ProjectModule,
    SelfModule,
    ConfigModule.forRoot(),
    CosModule,
    TeamModule,
    UserModule,
    GlobalModule,
    AuthModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
          keyPrefix: configService.get('REDIS_PREFIX')
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    AppService
  ]
})
export class AppModule {}
