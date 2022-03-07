import { GlazeI18n } from '@glaze/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WsBinaryAdapter } from './ws-binary.adapter'

async function bootstrap () {
  GlazeI18n.initI18n()

  const app = await NestFactory.create(
    AppModule,
    {
      logger: ['log', 'error', 'warn', 'debug']
    }
  )
  app.enableCors()
  app.useWebSocketAdapter(new WsBinaryAdapter(app))
  await app.listen(3000)
}
bootstrap()
