import { FolderController } from './folder.controller'
import { FolderService } from './folder.service'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { ProjectModule } from '../project/project.module'

@Module({
  imports: [
    ProjectModule
  ],
  controllers: [
    FolderController],
  providers: [
    FolderService]
})
export class FolderModule {}
