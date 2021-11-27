import { GlazeI18n } from '@glaze/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
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
  await app.listen(3000)
}
bootstrap()
