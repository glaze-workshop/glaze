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

@Injectable()
export class DocService {
  private docMap = new BidirectionalMap<number, WSSharedDoc>()

  constructor (private prisma: PrismaService) {}

  removeDoc (doc: WSSharedDoc) {
    this.docMap.deleteByValue(doc)
  }

  closeClientByProjectId (projectId: number, client: ws.WebSocket) {
    const doc = this.docMap.getByKey(projectId)
    if (doc) {
      doc.close(client)
    }
  }

  getDocByProjectId = async (projectId: number) => {
    if (this.docMap.has(projectId)) {
      return this.docMap.get(projectId)!
    } else {
      const doc = new WSSharedDoc(projectId, this)
      this.docMap.set(projectId, doc)
      const fullDocumentUpdate = await this.getFullDocument(projectId)
      Y.applyUpdate(doc, fullDocumentUpdate, 'database')
      return doc
    }
  }

  persistUpdate (projectId: number, update: Uint8Array) {
    return this.prisma.glazeDocumentUpdate.create({
      data: {
        project: { connect: { id: projectId } },
        update: Buffer.from(update)
      }
    })
  }

  async getFullDocument (projectId: number) {
    return this.prisma.$transaction(async (prisma) => {
      const fullDocUpdates = await prisma.glazeDocumentUpdate.findMany({
        where: { project: { id: projectId } }
      })
      const dbYDoc = new Y.Doc()

      dbYDoc.transact(() => {
        for (const u of fullDocUpdates) {
          Y.applyUpdate(dbYDoc, u.update)
        }
      })

      const encodedUpdates = Y.encodeStateAsUpdate(dbYDoc)

      if (fullDocUpdates.length <= 10) {
        return encodedUpdates
      } else {
        await prisma.glazeDocumentUpdate.deleteMany({ where: { id: { in: fullDocUpdates.map(u => u.id) } } })
        await prisma.glazeDocumentUpdate.create({
          data: {
            project: { connect: { id: projectId } },
            update: Buffer.from(encodedUpdates)
          }
        })
        return encodedUpdates
      }
    }, {
      maxWait: 5000, // default: 2000
      timeout: 10000 // default: 5000
    })
  }
}
