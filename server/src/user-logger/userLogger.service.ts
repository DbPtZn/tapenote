import { LoggerService, Injectable, Inject } from '@nestjs/common'
import { StorageService } from 'src/storage/storage.service'
import { REQUEST } from '@nestjs/core'
import fs from 'fs'

interface Log {
  level: 'info' | 'error' | 'warn' | 'debug' | 'verbose'
  message: string
  error?: string
  timestamp: string
}
@Injectable()
export class UserLoggerService implements LoggerService {
  constructor(
    @Inject(REQUEST) private request: any,
    private readonly storageService: StorageService
  ) {}
  /**
   * Write a 'log' level log.
   */
  log(message: any) {
    const log: Log = {
      level: 'info',
      message: message,
      timestamp: new Date().toTimeString().slice(0, 8)
    }
    console.log(this.getLoggerFilePath())
    fs.appendFile(this.getLoggerFilePath(), `${JSON.stringify(log)}\n`, err => {
      if (err) {
        console.error('写入日志出错:', err)
        throw err
      }
    })
  }

  getLog(date: string) {
    try {
      const txt = fs.readFileSync(this.getLoggerFilePath(date), 'utf8')
      return txt
        .split(/\}\s*\n/)
        .map(item => {
          if (item) {
            return JSON.parse(item + '}')
          }
        })
        .filter(item => item)
    } catch (error) {
      throw error
    }
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, error?: any) {
    const log: Log = {
      level: 'error',
      message: message,
      error: error || '',
      timestamp: new Date().toTimeString().slice(0, 8)
    }
    fs.appendFileSync(this.getLoggerFilePath(), `${JSON.stringify(log)}\n`)
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any) {
    const log: Log = {
      level: 'warn',
      message: message,
      timestamp: new Date().toTimeString().slice(0, 8)
    }
    fs.appendFileSync(this.getLoggerFilePath(), `${JSON.stringify(log)}\n`)
  }

  /**
   * Write a 'debug' level log.
   */
  // debug?(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'verbose' level log.
   */
  // verbose?(message: any, ...optionalParams: any[]) {}

  getLoggerFilePath(date?: string) {
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Date 格式错误，格式须满足 YYYY-MM-DD')
    }
    return this.storageService.getFilePath({
      dirname: this.request.user.dirname || 'error',
      filename: `log-${date ? date : new Date().toISOString().slice(0, 10)}.txt`,
      category: 'logs',
      prv: true
    })
  }
}
