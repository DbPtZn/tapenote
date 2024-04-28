import { Injectable, NestMiddleware } from '@nestjs/common'
import { LoggerService } from './logger.service'

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}
  use(req: any, res: any, next: () => void) {
    // const { ip } = req
    // const msg = `${ip} ${req.method} ${req.originalUrl}`
    // console.log(msg)
    // this.logger.log(msg)
    next()
  }
}
