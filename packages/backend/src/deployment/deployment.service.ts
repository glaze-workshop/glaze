/*
https://docs.nestjs.com/providers#services
*/
import { DeploymentDto, Entity, GlazeErr } from '@glaze/common'

import { Injectable } from '@nestjs/common'
import { Buffer } from 'buffer'
import { isUniqueConstraintError } from '../utils/prisma.error'
import { PrismaService } from '../global/prisma.service'
import { DocService } from '../doc/doc.service'
import { randomUrlLowerCase } from '../utils/random'

@Injectable()
export class DeploymentService {
  constructor(private prisma: PrismaService, private docService: DocService) {}

  selectWithoutData() {
    return {
      id: true,
      projectId: true,
      path: true,
      status: true,
      screenshot: true,
      createdAt: true,
      updatedAt: true,
      by: {
        select: {
          id: true,
          nickname: true,
          username: true,
          phone: true,
          avatar: true
        }
      }
    }
  }

  getDeployment(projectId: number): Promise<Entity.DeploymentEntity | null> {
    return this.prisma.glazeProjectDeployInfo.findUnique({
      where: {
        projectId
      },
      select: this.selectWithoutData()
    })
  }

  getDeploymentByPath(path: string) {
    return this.prisma.glazeProjectDeployInfo.findUnique({
      where: {
        path
      }
    })
  }

  async initDeployProject(
    projectId: number,
    userId: number
  ): Promise<Entity.DeploymentEntity> {
    const [updates] = await this.docService.getFullDocument(projectId)

    return this.prisma.glazeProjectDeployInfo.create({
      data: {
        projectId,
        path: `glaze-${randomUrlLowerCase()}`,
        info: Buffer.from(updates),
        byUserId: userId
      },
      select: this.selectWithoutData()
    })
  }

  async updateProjectDeployment(
    projectId: number,
    userId: number
  ): Promise<Entity.DeploymentEntity> {
    const [updates] = await this.docService.getFullDocument(projectId)
    return this.prisma.glazeProjectDeployInfo.update({
      where: {
        projectId
      },
      data: {
        info: Buffer.from(updates),
        byUserId: userId
      },
      select: this.selectWithoutData()
    })
  }

  async updateProjectDeploymentPath(
    projectId: number,
    path: string
  ): Promise<Entity.DeploymentEntity> {
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

  async updateDeploymentScreenshot(
    deploymentId: number,
    screenshot: string
  ): Promise<Entity.DeploymentEntity> {
    return this.prisma.glazeProjectDeployInfo.update({
      where: {
        id: deploymentId
      },
      data: {
        screenshot
      },
      select: this.selectWithoutData()
    })
  }

  async basicDeploymentAnalysis(
    projectId: number
  ): Promise<DeploymentDto.BasicDeploymentAnalysis | void> {
    const deploymentInfo = await this.prisma.glazeProjectDeployInfo.findUnique({
      where: {
        id: projectId
      },
      select: {
        id: true
      }
    })
    if (deploymentInfo) {
      const res = await this.prisma.glazeProjectLogInfo.aggregate({
        where: {
          deployInfoId: deploymentInfo.id
        },
        _sum: {
          size: true
        },
        _count: true
      })
      return {
        totalSize: res._sum.size ?? 0,
        count: res._count ?? 0
      }
    }
  }

  clickEvent({ time, ...other }: DeploymentDto.DeploymentClickEventDto) {
    return this.prisma.glazeProjectClickEvent.create({
      data: {
        ...other,
        time: new Date(time)
      }
    })
  }

  async getClickEvent(projectId: number, start: number, end: number) {
    const deployInfo = await this.prisma.glazeProjectDeployInfo.findFirst({
      where: { projectId },
      select: { id: true }
    })
    return this.prisma.glazeProjectClickEvent.findMany({
      where: {
        deploymentId: deployInfo?.id ?? -1,
        time: {
          gte: new Date(start),
          lte: new Date(end)
        }
      }
    })
  }
}
