import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Entity, GlazeErr } from '@glaze/common'
import { CosService } from '../global/cos.service'
import { PuppeteerService } from './puppeteer.service'
import { DeploymentService } from '../deployment/deployment.service'
import { DocService } from '../doc/doc.service'
import { ConfigService } from '@nestjs/config'
import { forwardRef, Inject } from '@nestjs/common'

@Processor('screenshot')
export class ScreenshotProcessor {
  constructor (
    private cosService: CosService,
    private puppeteerService: PuppeteerService,

    @Inject(forwardRef(() => DeploymentService))
    private deploymentService: DeploymentService,

    @Inject(forwardRef(() => DocService))
    private docService: DocService,
    private configService: ConfigService) {}

  @Process('deployment')
  async deployment (job: Job<Entity.DeploymentEntity>) {
    const { path, projectId, id } = job.data
    const deploymentUrl = `${path}.${this.configService.get<string>('DEPLOYMENT_PATH')}`
    const image = await this.puppeteerService.takeScreenshot(deploymentUrl)
    const imageInfo = await this.cosService.uploadImage(image, `/project/${projectId}/deployment/screenshot.webp`)
    await this.deploymentService.updateDeploymentScreenshot(id, imageInfo.Location)
  }

  @Process('preview')
  async preview (job: Job<any>) {
  }
}
