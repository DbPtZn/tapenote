import log4js from 'log4js'

const log = log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    console: { type: 'console' },
    app: {
      type: 'file',
      filename: `logs/main-${new Date().toISOString().slice(0, 10)}.log`,
      maxLogSize: 20 * 1024 * 1024,
      backups: 3,
      compress: false,
      encoding: 'utf-8',
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m'
      },
      keepFileExt: true
    },
  },
  categories: {
    default: { appenders: ['out', 'console', 'app'], level: 'info' }
  }
})

// everything: { type: 'file', filename: 'logs/app.log' },
// console: { type: 'console' }
const logger = log.getLogger()
export default logger