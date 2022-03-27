/*
https://docs.nestjs.com/controllers#controllers
*/

import { Prefix } from '@glaze/common'
import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common'
import { RenderService } from '../global/render.service'
import { DocService } from './doc.service'

@Controller(Prefix.DOC_PREFIX)
export class DocController {
  constructor(
    private docService: DocService,
    private readonly renderService: RenderService
  ) {}

  @Get('/preview/:projectId')
  @Render('project.pug')
  async preview(@Param('projectId', ParseIntPipe) projectId: number) {
    const [, yDoc] = await this.docService.getFullDocument(projectId)

    const nodesRaw = yDoc.getMap('components').toJSON()
    const structureRaw = yDoc.getArray('structure').toJSON()
    return this.renderService.generateTemplateConfig({
      projectId: projectId,
      nodes: nodesRaw,
      structure: structureRaw
    })
  }
}
