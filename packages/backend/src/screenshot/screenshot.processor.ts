import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { DeploymentApi, Entity, GlazeErr } from '@glaze/common'
import { CosService } from '../global/cos.service'
import { PuppeteerService } from './puppeteer.service'
import { DeploymentService } from '../deployment/deployment.service'
import { DocService } from '../doc/doc.service'
import { ConfigService } from '@nestjs/config'
import { forwardRef, Inject } from '@nestjs/common'
import { DeploymentScreenshotJob } from './screenshot.types'
import { MessageGateway } from '../message/message.gateway'

@Processor('screenshot')
export class ScreenshotProcessor {
  constructor (
    private cosService: CosService,
    private puppeteerService: PuppeteerService,
    private deploymentService: DeploymentService,
    private docService: DocService,
    private configService: ConfigService,
    private messageGateway: MessageGateway) {}

  @Process('deployment')
  async deployment (job: Job<DeploymentScreenshotJob>) {
    const { deployment: { path, projectId, id }, user } = job.data
    const deploymentUrl = `https://${path}.${this.configService.get<string>('DEPLOYMENT_PATH')}`
    const image = await this.puppeteerService.takeScreenshot(deploymentUrl)
    const imageInfo = await this.cosService.uploadImage(image, `/project/${projectId}/deployment/screenshot.webp`)
    await this.deploymentService.updateDeploymentScreenshot(id, imageInfo.Location)
    this.messageGateway.sendMessageToUser(user.id, DeploymentApi.FULL_DEPLOYMENT_PATH_TO_PATH({ projectId }))
  }

  @Process('preview')
  async preview (job: Job<any>) {
  }
}
