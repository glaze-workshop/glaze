import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { DeploymentApi, Entity, GlazeErr } from '@glaze/common'
import { CosService } from '../cos/cos.service'
import { PuppeteerService } from './puppeteer.service'
import { DeploymentService } from '../deployment/deployment.service'
import { ConfigService } from '@nestjs/config'
import { DeploymentScreenshotJob } from './screenshot.types'
import { MessageGateway } from '../message/message.gateway'
import { ProjectService } from '../project/project.service'
import { Logger } from '@nestjs/common'

@Processor('screenshot')
export class ScreenshotProcessor {
  constructor(
    private cosService: CosService,
    private puppeteerService: PuppeteerService,
    private deploymentService: DeploymentService,
    private projectService: ProjectService,
    private configService: ConfigService,
    private messageGateway: MessageGateway
  ) {}

  private readonly logger = new Logger(ScreenshotProcessor.name)

  @Process('deployment')
  async deployment(job: Job<DeploymentScreenshotJob>) {
    const {
      deployment: { path, projectId, id },
      user
    } = job.data
    const deploymentUrl = `https://${path}.${this.configService.get<string>(
      'DEPLOYMENT_PATH'
    )}`
    const image = await this.puppeteerService.takeScreenshot(deploymentUrl)
    const imageInfo = await this.cosService.uploadImage(
      image,
      `/project/${projectId}/deployment/screenshot.webp`
    )
    await this.deploymentService.updateDeploymentScreenshot(
      id,
      imageInfo.Location
    )
    this.messageGateway.sendMessageToUser(
      user.id,
      DeploymentApi.FULL_DEPLOYMENT_PATH_TO_PATH({ projectId })
    )
  }

  @Process('preview')
  async preview(job: Job<number>) {
    const projectId = job.data

    const previewUrl = `https://${projectId}.${this.configService.get<string>(
      'PREVIEW_PATH'
    )}`

    this.logger.log(`Taking screenshot of ${previewUrl}`)
    const image = await this.puppeteerService.takeScreenshot(previewUrl)
    const imageInfo = await this.cosService.uploadImage(
      image,
      `/project/${projectId}/preview/screenshot.webp`
    )
    this.logger.log(`ImageInfo ${imageInfo.Location}`)
    await this.projectService.updateProjectImage(projectId, imageInfo.Location)
  }
}
