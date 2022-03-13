/*
https://docs.nestjs.com/controllers#controllers
*/

import { Prefix, ProjectApi, ProjectDto } from '@glaze/common'
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common'
import { ProjectService } from './project.service'

@Controller(Prefix.PROJECT_PREFIX)
export class ProjectController {
  constructor (private projectService: ProjectService) {}

  /** 创建项目 */
  @Post(ProjectApi.PROJECT_PATH)
  createProject (@Body() projectDTO: ProjectDto.ProjectCreationDTO) {
    return this.projectService.createProject(projectDTO)
  }

  /** 获得项目列表 */
  @Get(ProjectApi.PROJECT_PATH)
  getProjects (@Query() folderId: number) {
    return this.projectService.getProjects(folderId)
  }

  /** 更新项目 */
  @Put(ProjectApi.PROJECT_PATH_WITH_ID)
  updateProject (@Body() projectDTO: ProjectDto.ProjectUpdateDTO) {
    return this.projectService.updateProject(projectDTO)
  }

  /** 获得项目详情 */
  @Get(ProjectApi.PROJECT_PATH_WITH_ID)
  getProject (@Param('id', ParseIntPipe) id: number) {
    return this.projectService.getProject(id)
  }

  /** 删除项目 */
  @Delete(ProjectApi.PROJECT_PATH_WITH_ID)
  deleteProject (@Param('id', ParseIntPipe) id: number) {
    return this.projectService.deleteProject(id)
  }

  /** 存档项目 */
  @Put(ProjectApi.PROJECT_ARCHIVE_PATH)
  archiveProject (@Param('id', ParseIntPipe) id: number) {
    return this.projectService.archiveProject(id)
  }
}
