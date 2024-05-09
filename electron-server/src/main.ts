import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import dotenv from 'dotenv'
import { LoggerService } from './logger/logger.service'
import { ValidationPipe } from '@nestjs/common'
import path from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { PouchDBService } from './pouchdb/pouchdb.service'
import { ConfigService } from '@nestjs/config'
import portfinder from 'portfinder'

// process.on('message', (msg) => {
//   console.log('server服务器：')
//   console.log(msg)
//   bootstrap(msg)
// })

async function bootstrap() {
  // 注意：两种情况，nest 启动时指向 nest 目录下的环境变量， electron 启动时指向 electron 目录下的环境变量
  dotenv.config({
    path:
      process.env.NODE_ENV === 'development'
        ? ['.env.electron.local', '.env.electron']
        : ['.env.electron.local', '.env.electron']
  })
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: false })

  // 生产环境下开启自动记录系统日志功能
  process.env.LOG_OPEN === 'true' && app.useLogger(app.get(LoggerService))

  // 数据验证错误的响应
  app.useGlobalPipes(new ValidationPipe())

  // 允许跨域
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true
    // maxAge: 3600 * 24
  })

  // 开放静态资源
  const configService = app.get(ConfigService)
  const __rootdirname = process.cwd()
  const userDir = configService.get('common.userDir')
  const publicDir = configService.get('common.publicDir')
  console.log(path.join(__rootdirname, userDir, publicDir))
  app.useStaticAssets(path.join(__rootdirname, userDir, publicDir), { prefix: '/public' })

  // 初始化数据库
  const pouchdb = app.get(PouchDBService)
  pouchdb.init()

  // 开放端口（在环境变量中设置）
  const port = parseInt(process.env.SERVER_PORT, 10)
  portfinder.basePort = port
  portfinder.getPort(async (err, availablePort) => {
    if (err) {
      console.error(err)
    } else {
      console.log(`正在监听 ${availablePort} 端口`)
      await app.listen(availablePort)
    }
  })
}
bootstrap()

// function isPortAvailable(port, callback) {
//   const server = http.createServer().listen(port, () => {
//     server.close()
//     callback(true)
//   })
//   server.on('error', () => {
//     callback(false)
//   })
// }
// function findAvailablePort(startPort: number, callback: (availablePort: number) => void) {
//   isPortAvailable(startPort, available => {
//     if (available) {
//       callback(startPort)
//     } else {
//       findAvailablePort(startPort + 1, callback)
//     }
//   })
// }
