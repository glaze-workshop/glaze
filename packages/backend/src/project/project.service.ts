/*
https://docs.nestjs.com/providers#services
*/

import { Entity } from '@glaze/common'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'

@Injectable()
export class ProjectService {
  constructor (private prisma: PrismaService) {}

  getProjectFolderByMemberId (memberId: number): Promise<Entity.ProjectFolderEntity[]> {
    return this.prisma.glazeProjectFolder.findMany({
      where: {
        team: {
          members: {
            some: {
              memberId: { equals: memberId }
            }
          }
        }
      }
    })
  }
}
