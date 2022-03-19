/*
https://docs.nestjs.com/controllers#controllers
*/

import { DeploymentApi, Prefix } from '@glaze/common'
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Render } from '@nestjs/common'
import { DeploymentService } from './deployment.service'
import * as Y from 'yjs'

@Controller(Prefix.DEPLOYMENT_PREFIX)
export class DeploymentController {
  constructor (private readonly deploymentService: DeploymentService) {}

  @Get(DeploymentApi.DEPLOYMENT_PATH)
  getProjectDeployment (@Param('projectId', ParseIntPipe) id: number) {
    return this.deploymentService.getDeployment(id)
  }

  @Post(DeploymentApi.DEPLOYMENT_PATH)
  initDeployProject (@Param('projectId', ParseIntPipe) id: number) {
    return this.deploymentService.initDeployProject(id)
  }

  @Put(DeploymentApi.DEPLOYMENT_PATH)
  updateDeployProject (@Param('projectId', ParseIntPipe) id: number) {
    return this.deploymentService.updateProjectDeployment(id)
  }

  @Put(DeploymentApi.DEPLOYMENT_PATH_PATH)
  updateDeployProjectPath (@Param('projectId', ParseIntPipe) id: number, @Body() path: string) {
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
