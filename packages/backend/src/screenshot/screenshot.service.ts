/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { DeploymentScreenshotJob } from './screenshot.types'
import { BehaviorSubject, debounceTime } from 'rxjs'

@Injectable()
export class ScreenshotService {
  private readonly previewDebounceMap = new Map<
    number,
    BehaviorSubject<number>
  >()

  constructor(
    @InjectQueue('screenshot') private readonly screenshotQueue: Queue
  ) {}

  addDeploymentJob(deployment: DeploymentScreenshotJob) {
    return this.screenshotQueue.add('deployment', deployment)
  }

  addPreviewQueue(projectId: number) {
    const previewObserver = this.previewDebounceMap.get(projectId)
    if (previewObserver) {
      previewObserver.next(projectId)
    } else {
      const previewObserver = new BehaviorSubject(projectId)
      this.previewDebounceMap.set(projectId, previewObserver)
      const subscriber = previewObserver
        .pipe(debounceTime(3000))
        .subscribe((projectId) => {
          this.screenshotQueue.add('preview', projectId)
          subscriber.unsubscribe()
          this.previewDebounceMap.delete(projectId)
        })
    }
  }
}
