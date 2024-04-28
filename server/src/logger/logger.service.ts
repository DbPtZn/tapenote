import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import winston from 'winston'

@Injectable()
export class LoggerService {
  logger: winston.Logger
  constructor(private readonly configService: ConfigService) {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          dirname: this.configService.get('LOG_DIR'),
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
