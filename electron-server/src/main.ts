import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import dotenv from 'dotenv'
import { LoggerService } from './logger/logger.service'
import { ValidationPipe } from '@nestjs/common'
import path from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { PouchDBService } from './pouchdb/pouchdb.service'
async function bootstrap() {
  dotenv.config({
    path:
      process.env.NODE_ENV === 'development'
        ? ['.env.development.local', '.env.development']
        : ['.env.production.local', '.env.production']
  })
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: false })

  // 生产环境下开启自动记录系统日志功能
  process.env.LOG_OPEN === 'true' && app.useLogger(app.get(LoggerService))

  /** 数据验证错误的响应 */
  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true
    // maxAge: 3600 * 24
  })

  // 开放静态资源
  const __rootdirname = process.cwd()
  // console.log(__rootdirname)
  app.useStaticAssets(path.join(__rootdirname, 'public'), { prefix: '/public' })

  const pouchdb = app.get(PouchDBService)
  pouchdb.init(process.env.NODE_ENV === 'development' ? 'dev' : 'prod')
  /** 开放端口（请在环境变量中设置） */
  const port = parseInt(process.env.SERVER_PORT, 10)
  console.log(`正在监听 ${port} 端口`)
  await app.listen(port)
}
bootstrap()
