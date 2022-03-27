/*
https://docs.nestjs.com/controllers#controllers
*/

import { DeploymentApi, DeploymentDto, Entity, Prefix } from '@glaze/common'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Render,
  UseGuards
} from '@nestjs/common'
import { DeploymentService } from './deployment.service'
import * as Y from 'yjs'
import { CurrentUser } from '../auth/user.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import { ScreenshotService } from '../screenshot/screenshot.service'
import { RenderService } from '../global/render.service'
import { PluginService } from '../plugin/plugin.service'

@Controller(Prefix.DEPLOYMENT_PREFIX)
export class DeploymentController {
  constructor(
    private readonly deploymentService: DeploymentService,
    private readonly screenshotService: ScreenshotService,
    private readonly renderService: RenderService,
    private readonly pluginService: PluginService
  ) {}

  @Get(DeploymentApi.DEPLOYMENT_PATH)
  getProjectDeployment(@Param('projectId', ParseIntPipe) id: number) {
    return this.deploymentService.getDeployment(id)
  }

  @UseGuards(JwtGuard)
  @Post(DeploymentApi.DEPLOYMENT_PATH)
  async initDeployProject(
    @CurrentUser() user: Entity.UserEntity,
    @Param('projectId', ParseIntPipe) id: number
  ) {
    const deployment = await this.deploymentService.initDeployProject(
      id,
      user.id
    )
    this.screenshotService.addDeploymentJob({ user, deployment })
    return deployment
  }

  @UseGuards(JwtGuard)
  @Put(DeploymentApi.DEPLOYMENT_PATH)
  async updateDeployProject(
    @CurrentUser() user: Entity.UserEntity,
    @Param('projectId', ParseIntPipe) id: number
  ) {
    const deployment = await this.deploymentService.updateProjectDeployment(
      id,
      user.id
    )
    this.screenshotService.addDeploymentJob({ user, deployment })
    return deployment
  }

  @Put(DeploymentApi.DEPLOYMENT_PATH_PATH)
  updateDeployProjectPath(
    @Param('projectId', ParseIntPipe) id: number,
    @Body() { path }: { path: string }
  ) {
    return this.deploymentService.updateProjectDeploymentPath(id, path)
  }

  @Get(DeploymentApi.DEPLOYMENT_RENDER_PATH)
  @Render('project.pug')
  async deployment(@Param('path') path: string) {
    const deploymentInfo = await this.deploymentService.getDeploymentByPath(
      path
    )
    if (deploymentInfo) {
      const yDoc = new Y.Doc()
      Y.applyUpdate(yDoc, deploymentInfo.info)
      const plugins = await this.pluginService.getAllProjectUsedPluginConfig(
        deploymentInfo.projectId
      )
      const nodesRaw = yDoc.getMap('components').toJSON()
      const structureRaw = yDoc.getArray('structure').toJSON()
      return this.renderService.generateTemplateConfig({
        isPreview: false,
        projectId: deploymentInfo.projectId,
        deploymentId: deploymentInfo.id,
        nodes: nodesRaw,
        structure: structureRaw,
        pluginConfig: plugins.reduce(
          (pre, cur) => ({ ...pre, [cur.plugin.id]: cur.config }),
          {}
        ),
        pluginSrc: plugins.map(
          pluginConfig => `https://${pluginConfig.plugin.path}`
        )
      })
    }
    return this.renderService.generateTemplateConfig({ projectId: -1 })
  }

  @Get(DeploymentApi.DEPLOYMENT_HEATMAP_RENDER_PATH)
  @Render('project.pug')
  async deploymentWithHeatmap(@Param('path') path: string) {
    const deploymentInfo = await this.deploymentService.getDeploymentByPath(
      path
    )
    if (deploymentInfo) {
      const yDoc = new Y.Doc()
      Y.applyUpdate(yDoc, deploymentInfo.info)
      const nodesRaw = yDoc.getMap('components').toJSON()
      const structureRaw = yDoc.getArray('structure').toJSON()
      return this.renderService.generateTemplateConfig({
        isPreview: false,
        projectId: deploymentInfo.projectId,
        deploymentId: deploymentInfo.id,
        nodes: nodesRaw,
        structure: structureRaw,
        heatmap: true
      })
    }
    return this.renderService.generateTemplateConfig({ projectId: -1 })
  }

  @Post(DeploymentApi.DEPLOYMENT_CLICK_EVENT_PATH)
  clickEvent(@Body() event: DeploymentDto.DeploymentClickEventDto) {
    return this.deploymentService.clickEvent(event)
  }
  @Get(DeploymentApi.DEPLOYMENT_CLICK_EVENT_PATH)
  getClickEvent(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query('start', ParseIntPipe) start: number,
    @Query('end', ParseIntPipe) end: number
  ) {
    return this.deploymentService.getClickEvent(projectId, start, end)
  }
}
