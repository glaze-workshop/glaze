import { GlazeI18n } from '@glaze/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WsBinaryAdapter } from './ws-binary.adapter'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'

async function bootstrap () {
  GlazeI18n.initI18n()

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.enableCors()
  app.useWebSocketAdapter(new WsBinaryAdapter(app))
  await app.listen(3000)
}
bootstrap()
