/*
https://docs.nestjs.com/providers#services
*/

import { Entity, ProjectDto } from '@glaze/common'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../global/prisma.service'

@Injectable()
export class ProjectService {
  constructor (private prisma: PrismaService) {}

  public generateSelect (withDocument = false) {
    return {
      id: true,
      name: true,
      intro: true,
      preview: true,
      projectFolderId: true,
      document: withDocument,
      documentBytes: withDocument,
      createdAt: true,
      updatedAt: true
    }
  }

  getProject (projectId: number, withDocument = false): Promise<Entity.ProjectEntity | null> {
    return this.prisma.glazeProject.findUnique({
      where: {
        id: projectId
      },
      select: {
        ...this.generateSelect(withDocument),
        projectFolder: {
          include: {
            team: true
          }
        }
      }
    })
  }

  deleteProject (projectId: number): Promise<Entity.ProjectEntity> {
    return this.prisma.glazeProject.delete({
      where: {
        id: projectId
      }
    })
  }

  async archiveProject (projectId: number) {
    const projectWithFolders = await this.prisma.glazeProject.findUnique({
      where: {
        id: projectId
      },
      select: {
        projectFolder: {
          select: {
            team: {
              select: {
                projectFolders: {
                  select: {
                    id: true,
                    type: true
                  }
                }
              }
            }
          }
        }
      }
    })
    const archiveFolderId = projectWithFolders?.projectFolder?.team?.projectFolders.find(folder => folder.type === Entity.GlazeFolderTypeEnum.ARCHIVED)?.id

    if (archiveFolderId) {
      await this.prisma.glazeProject.update({
        where: {
          id: projectId
        },
        data: {
          projectFolderId: archiveFolderId
        }
      })
    }
  }

  getProjects (folderId: number): Promise<Entity.ProjectEntity[]> {
    return this.prisma.glazeProject.findMany({
      select: this.generateSelect(),
      where: {
        projectFolderId: { equals: folderId }
      }
    })
  }

  createProject (creationInfo: ProjectDto.ProjectCreationDTO): Promise<Entity.ProjectEntity> {
    return this.prisma.glazeProject.create({
      data: creationInfo
    })
  }

  updateProject (projectUpdateDTO: ProjectDto.ProjectUpdateDTO): Promise<Entity.ProjectEntity> {
    return this.prisma.glazeProject.update({
      where: {
        id: projectUpdateDTO.id
      },
      data: projectUpdateDTO
    })
  }
}
