/*
https://docs.nestjs.com/controllers#controllers
*/

import { DeploymentApi, Entity, Prefix } from '@glaze/common'
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Render, UseGuards } from '@nestjs/common'
import { DeploymentService } from './deployment.service'
import * as Y from 'yjs'
import { CurrentUser } from '../auth/user.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import { ScreenshotService } from '../screenshot/screenshot.service'

@Controller(Prefix.DEPLOYMENT_PREFIX)
export class DeploymentController {
  constructor (private readonly deploymentService: DeploymentService,
    private readonly screenshotService: ScreenshotService) {}

  @Get(DeploymentApi.DEPLOYMENT_PATH)
  getProjectDeployment (@Param('projectId', ParseIntPipe) id: number) {
    return this.deploymentService.getDeployment(id)
  }

  @UseGuards(JwtGuard)
  @Post(DeploymentApi.DEPLOYMENT_PATH)
  async initDeployProject (@CurrentUser() user: Entity.UserEntity, @Param('projectId', ParseIntPipe) id: number) {
    const deployment = await this.deploymentService.initDeployProject(id)
    this.screenshotService.addDeploymentJob({ user, deployment })
    return deployment
  }

  @UseGuards(JwtGuard)
  @Put(DeploymentApi.DEPLOYMENT_PATH)
  async updateDeployProject (@CurrentUser() user: Entity.UserEntity, @Param('projectId', ParseIntPipe) id: number) {
    const deployment = await this.deploymentService.updateProjectDeployment(id)
    this.screenshotService.addDeploymentJob({ user, deployment })
    return deployment
  }

  @Put(DeploymentApi.DEPLOYMENT_PATH_PATH)
  updateDeployProjectPath (@Param('projectId', ParseIntPipe) id: number, @Body() { path }: { path: string }) {
    return this.deploymentService.updateProjectDeploymentPath(id, path)
  }

  @Get(DeploymentApi.DEPLOYMENT_RENDER_PATH)
  @Render('project.pug')
  async deployment (@Param('path') path: string) {
    const deploymentInfo = await this.deploymentService.getDeploymentByPath(path)
    if (deploymentInfo) {
      const yDoc = new Y.Doc()
      Y.applyUpdate(yDoc, deploymentInfo.info)
      const nodesRaw = yDoc.getMap('components').toJSON()
      const structureRaw = yDoc.getArray('structure').toJSON()
      return { nodes: JSON.stringify(nodesRaw), structure: JSON.stringify(structureRaw) }
    }
    return { nodes: '{}', structure: '[]' }
  }
}
