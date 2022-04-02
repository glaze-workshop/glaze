/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { Buffer } from 'buffer'
import * as Y from 'yjs'
import { WSSharedDoc } from './WsSharedDoc'
import * as ws from 'ws'
import BidirectionalMap from '../utils/BidirectionalMap'
import { RedisService } from '../global/redis.service'
import { ScreenshotService } from '../screenshot/screenshot.service'

@Injectable()
export class DocService {
  private docMap = new BidirectionalMap<number, WSSharedDoc>()

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private screenshotService: ScreenshotService
  ) {}

  removeDoc(doc: WSSharedDoc) {
    this.docMap.deleteByValue(doc)
  }

  closeClientByProjectId(projectId: number, client: ws.WebSocket) {
    const doc = this.docMap.getByKey(projectId)
    if (doc) {
      doc.close(client)
    }
  }

  getDocByProjectId = async (projectId: number) => {
    if (this.docMap.has(projectId)) {
      return this.docMap.get(projectId)!
    } else {
      const doc = new WSSharedDoc(projectId, this, this.redisService)
      const [fullDocumentUpdate] = await this.getFullDocument(projectId)
      doc.applyUpdate(fullDocumentUpdate, 'database')
      this.docMap.set(projectId, doc)
      return doc
    }
  }

  async persistUpdate(projectId: number, update: Uint8Array) {
    const documentUpdate = await this.prisma.glazeDocumentUpdate.create({
      data: {
        project: { connect: { id: projectId } },
        update: Buffer.from(update)
      }
    })
    this.screenshotService.addPreviewQueue(projectId)

    return documentUpdate
  }

  async getFullDocument(projectId: number): Promise<[Uint8Array, Y.Doc]> {
    const fullDocUpdates = await this.prisma.glazeDocumentUpdate.findMany({
      where: { project: { id: projectId } }
    })
    const dbYDoc = new Y.Doc()

    dbYDoc.transact(() => {
      for (const u of fullDocUpdates) {
        Y.applyUpdate(dbYDoc, u.update)
      }
    })

    const encodedUpdates = Y.encodeStateAsUpdate(dbYDoc)

    if (fullDocUpdates.length > 10) {
      this.prisma.$transaction([
        this.prisma.glazeDocumentUpdate.deleteMany({
          where: { id: { in: fullDocUpdates.map((u) => u.id) } }
        }),
        this.prisma.glazeDocumentUpdate.create({
          data: {
            project: { connect: { id: projectId } },
            update: Buffer.from(encodedUpdates)
          }
        })
      ])
    }
    return [encodedUpdates, dbYDoc]
  }

  checkUserInProject(projectId: number, userId: number) {
    return this.prisma.glazeProject.findFirst({
      where: {
        id: projectId,
        projectFolder: {
          team: {
            members: {
              some: {
                memberId: userId
              }
            }
          }
        }
      },
      include: {
        projectFolder: {
          include: {
            team: {
              include: {
                members: true
              }
            }
          }
        }
      }
    })
  }
}
