/*
https://docs.nestjs.com/providers#services
*/

import { Entity } from '@glaze/common'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { ProjectService } from '../project/project.service'

@Injectable()
export class FolderService {
  constructor (private prisma: PrismaService, private projectService: ProjectService) {}

  createFolderInTeam (teamId: number, name: string, type: Entity.GlazeFolderType = Entity.GlazeFolderTypeEnum.CUSTOM) {
    return this.prisma.glazeProjectFolder.create({
      data: {
        name,
        teamId,
        type
      }
    })
  }

  updateFolderName (folderId: number, name: string) {
    return this.prisma.glazeProjectFolder.update({
      where: {
        id: folderId
      },
      data: {
        name
      }
    })
  }

  getFolderInfoById (folderId: number) {
    return this.prisma.glazeProjectFolder.findUnique({
      where: {
        id: folderId
      },
      include: {
        projects: {
          select: this.projectService.generateSelect()
        },
        team: true
      }
    })
  }

  /**
   * TODO: 删除文件夹，即将所有文件移入 archive 文件夹再删除文件夹
   */
  async deleteFolder (folderId: number) {
    const folder = await this.getFolderInfoById(folderId)
  }
}
