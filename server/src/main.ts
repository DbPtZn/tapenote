import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import path from 'path'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
async function bootstrap() {
  dotenv.config({
    path:
      process.env.NODE_ENV === 'development'
        ? ['.env.development.local', '.env.development']
        : ['.env.production.local', '.env.production']
  })
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true })
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true
    // maxAge: 3600 * 24
  })

  /* 通过适当地设置 HTTP 头, 免受一些众所周知的 Web 漏洞的影响* */
  // app.use(helmet())

  /** CSRF保护 */
  // app.use(csurf())

  /** 版本控制 */
  app.enableVersioning({
    // 使用 uri 作为版本标识
    type: VersioningType.URI
  })

  /** 数据验证错误的响应 */
  app.useGlobalPipes(new ValidationPipe())

  // 开放静态资源
  const __rootdirname = process.cwd()
  // console.log(__rootdirname)
  app.useStaticAssets(path.join(__rootdirname, 'public'), { prefix: '/public' })

  /** 接口文档(待完善) */
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('接口文档')
    .setDescription('描述')
    .setVersion('1')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/api-docs', app, document)

  /** 开放端口（请在环境变量中设置） */
  const port = parseInt(process.env.SERVER_PORT, 10)
  await app.listen(port)
}
bootstrap()
