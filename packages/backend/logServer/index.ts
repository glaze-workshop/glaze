import net from 'net'
import { Log } from './type'
import { PrismaClient } from '@prisma/client'

const server = net.createServer()
const prisma = new PrismaClient()

server.on('connection', (socket) => {
  socket.on('data', (data) => {
    const raw = data.toString()
    try {
      const parsed: Log = JSON.parse(raw)
      const host = parsed.request.host
      const path = host.split('.')[0]
      if (parsed.request.uri !== '/favicon.ico') {
        insertLogByPath(path, parsed)
      }
    } catch (e) {
      console.log(raw)
    }
  })
})

async function insertLogByPath (path: string, log: Log) {
  const deployInfo = await prisma.glazeProjectDeployInfo.findFirst({
    where: {
      path
    }
  })
  if (deployInfo) {
    await prisma.glazeProjectLogInfo.create({
      data: {
        deployInfoId: deployInfo.id,
        remoteAddr: log.request.remote_addr,
        protocol: log.request.proto,
        method: log.request.method,
        host: log.request.host,
        uri: log.request.uri,
        status: log.status,
        size: log.size,
        duration: log.duration,
        time: new Date(log.ts * 1000)
      }
    })
  }
}

server.listen(2329, () => {
  console.log('listening on 2329')
})
