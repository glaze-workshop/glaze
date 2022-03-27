/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { Entity } from '@glaze/common'
import { DeploymentScreenshotJob } from './screenshot.types'

@Injectable()
export class ScreenshotService {
  constructor(
    @InjectQueue('screenshot') private readonly screenshotQueue: Queue
  ) {}

  addDeploymentJob(deployment: DeploymentScreenshotJob) {
    return this.screenshotQueue.add('deployment', deployment)
  }

  addPreviewQueue(preview: any) {
    return this.screenshotQueue.add('preview', preview)
  }
}
