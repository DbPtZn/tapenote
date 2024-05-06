import { Injectable, NestMiddleware } from '@nestjs/common'
import { LoggerService } from './logger.service'

/** 中间件：可以在这里可以记录请求日志  */
@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor() {}
  use(req: any, res: any, next: () => void) {
    // const { ip } = req
    // const msg = `${ip} ${req.method} ${req.originalUrl}`
    // console.log(msg)
    // this.logger.log(msg)
    next()
  }
}
