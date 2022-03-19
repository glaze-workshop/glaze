/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { Entity } from '@glaze/common'

@Injectable()
export class ScreenshotService {
  constructor (@InjectQueue('screenshot') private readonly screenshotQueue: Queue) {
  }

  addDeploymentJob (deployment: Entity.DeploymentEntity) {
    return this.screenshotQueue.add('deployment', deployment)
  }

  addPreviewQueue (preview: any) {
    return this.screenshotQueue.add('preview', preview)
  }
}
