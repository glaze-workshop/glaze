import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [
    ProjectController],
  providers: [
    ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
