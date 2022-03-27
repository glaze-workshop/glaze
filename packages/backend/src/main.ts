import { GlazeI18n } from '@glaze/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WsBinaryAdapter } from './ws-binary.adapter'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { join } from 'path'

async function bootstrap () {
  GlazeI18n.initI18n()

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  app.enableCors()
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/'
  })
  app.setViewEngine({
    engine: {
      pug: require('pug')
    },
    templates: join(__dirname, '../../views')
  })
  app.useWebSocketAdapter(new WsBinaryAdapter(app))
  await app.listen(3000, '127.0.0.1')
}

bootstrap()
