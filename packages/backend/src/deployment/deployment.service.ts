/*
https://docs.nestjs.com/providers#services
*/
import { Entity, GlazeErr } from '@glaze/common'

import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { Buffer } from 'buffer'
import { isUniqueConstraintError } from '../utils/prisma.error'
import { PrismaService } from '../global/prisma.service'
import { DocService } from '../doc/doc.service'
import { ScreenshotService } from '../screenshot/screenshot.service'

@Injectable()
export class DeploymentService {
  constructor (
    private screenshotService: ScreenshotService,
    private prisma: PrismaService, private docService: DocService) {}

  selectWithoutData () {
    return {
      id: true,
      projectId: true,
      path: true,
      status: true,
      screenshot: true,
      createdAt: true,
      updatedAt: true
    }
  }

  getDeployment (projectId: number): Promise<Entity.DeploymentEntity | null> {
    return this.prisma.glazeProjectDeployInfo.findUnique({
      where: {
        projectId
      },
      select: this.selectWithoutData()
    })
  }

  getDeploymentByPath (path: string) {
    return this.prisma.glazeProjectDeployInfo.findUnique({
      where: {
        path
      }
    })
  }

  async initDeployProject (projectId: number): Promise<Entity.DeploymentEntity> {
    const [updates] = await this.docService.getFullDocument(projectId)

    return this.prisma.glazeProjectDeployInfo.create({
      data: {
        projectId,
        path: nanoid(8),
        info: Buffer.from(updates)
      },
      select: this.selectWithoutData()
    })
  }

  async updateProjectDeployment (projectId: number): Promise<Entity.DeploymentEntity> {
    const [updates] = await this.docService.getFullDocument(projectId)
    return this.prisma.glazeProjectDeployInfo.update({
      where: {
        projectId
      },
      data: {
        info: Buffer.from(updates)
      },
      select: this.selectWithoutData()
    })
  }

  async updateProjectDeploymentPath (projectId: number, path: string): Promise<Entity.DeploymentEntity> {
    try {
      return await this.prisma.glazeProjectDeployInfo.update({
        where: {
          projectId
        },
        data: {
          path
        },
        select: this.selectWithoutData()
      })
    } catch (e) {
      if (isUniqueConstraintError<Entity.DeploymentEntity>(e)) {
        if (e.meta.target.includes('path')) {
          throw new GlazeErr.DeploymentPathDuplicationError(path)
        }
      }
      throw e
    }
  }

  async updateDeploymentScreenshot (deploymentId: number, screenshot: string): Promise<Entity.DeploymentEntity> {
    return await this.prisma.glazeProjectDeployInfo.update({
      where: {
        id: deploymentId
      },
      data: {
        screenshot
      },
      select: this.selectWithoutData()
    })
  }
}
