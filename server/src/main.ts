import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import path from 'path'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { UserLoggerService } from './user-logger/userLogger.service'
import { LoggerService } from './logger/logger.service'
async function bootstrap() {
  dotenv.config({
    path:
      process.env.NODE_ENV === 'development'
        ? ['.env.development.local', '.env.development']
        : ['.env.production.local', '.env.production']
  })
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  })
  // 开发环境下开启系统日志功能
  process.env.LOG_OPEN === 'true' && app.useLogger(app.get(LoggerService))

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

  // 注册 Express 中间件
  // app.use(interceptStaticAssets)

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

// 创建 Express 拦截静态资源请求的中间件函数
// function interceptStaticAssets(req, res, next) {
//   // 获取请求路径
//   const url = req.originalUrl
//   console.log(req.headers)
//   // 在这里编写拦截逻辑，示例：拦截以 '/public' 开头的静态资源请求
//   if (url.startsWith('/public')) {
//     console.log('拦截到静态资源请求:', url)
//     // 这里可以执行拦截后的处理逻辑，例如返回自定义的响应或者重定向到其他页面
//     // res.status(403).send('拦截到静态资源请求，禁止访问')
//     return next()
//   }

//   // 如果不需要拦截，则调用 next() 继续处理后续中间件或路由
//   next()
// }
