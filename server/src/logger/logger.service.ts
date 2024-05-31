import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import winston from 'winston'

@Injectable()
export class LoggerService {
  logger: winston.Logger
  constructor(private readonly configService: ConfigService) {
    const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
    const dirname = common.appDir ? `${common.appDir}/${common.logDir}` : common.logDir
    console.log('公共日志目录:' + dirname)
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          dirname: dirname,
          filename: `log-${new Date().toISOString().slice(0, 10)}.log`,
          maxsize: 5242880 // 5MB
        })
      ]
    })
  }

  log(message: string) {
    this.logger.log('info', message)
  }

  error(message: string) {
    this.logger.log('error', message)
  }

  warn(message: string) {
    this.logger.log('warn', message)
  }
}
