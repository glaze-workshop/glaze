/*
https://docs.nestjs.com/controllers#controllers
*/

import { FolderApi, FolderDto, Prefix } from '@glaze/common'
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { FolderService } from './folder.service'

@Controller(Prefix.FOLDER_PREFIX)
export class FolderController {
  constructor (private folderService: FolderService) {}

  @Post(FolderApi.FOLDER_PATH)
  createFolder (@Body() folderDTO: FolderDto.FolderCreationDTO) {
    return this.folderService.createFolderInTeam(folderDTO.teamId, folderDTO.name)
  }

  @Put(FolderApi.FOLDER_PATH_WITH_ID)
  updateFolder (@Body() folderDTO: FolderDto.FolderUpdateDTO) {
    return this.folderService.updateFolderName(folderDTO.id, folderDTO.name)
  }

  @Delete(FolderApi.FOLDER_PATH_WITH_ID)
  deleteFolder (@Param('id', ParseIntPipe) id: number) {
    return this.folderService.deleteFolder(id)
  }

  @Get(FolderApi.FOLDER_PATH_WITH_ID)
  getFolder (@Param('id', ParseIntPipe) id: number) {
    return this.folderService.getFolderInfoById(id)
  }
}
