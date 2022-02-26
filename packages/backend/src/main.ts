import { GlazeI18n } from '@glaze/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap () {
  GlazeI18n.initI18n()

  const app = await NestFactory.create(
    AppModule,
    {
      logger: ['log', 'error', 'warn', 'debug']
    }
  )
  app.enableCors()
  await app.listen(3000)
}
bootstrap()
