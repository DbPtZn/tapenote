import { app, ipcMain } from 'electron'
import portfinder from 'portfinder'
import logger from './logService'
export function useProcessEnv() {
  // NODE_ENV
  process.env.NODE_ENV = 'electron'

  // database
  process.env.DB_DATE_BASE = `${app.getPath('appData')}/tapenote/database/database.sqlite`
  // commom
  process.env.V_CODE_OPEN = 'false' // 是否开启验证码
  process.env.LOG_DIR = '/logs' // 日志目录
  process.env.LOG_OPEN = 'true' // 是否开启系统日志
  // path
  process.env.APP_DIR = `${app.getPath('appData')}/tapenote/data`
  process.env.USER_DIR = 'assets' // 用户目录
  process.env.PUBLIC_DIR = '/public' // 公共目录
  process.env.STATIC_RESOURCE_PREFIX = '/public'
  process.env.PRIVATE_DIR = '/private' // 私有目录
  // auth
  process.env.JWT_SECRET = 'electronJWT'
  // port
  portfinder.basePort = 3080
  portfinder.getPort((err, availablePort) => {
    if (err) {
      console.error(err)
      logger.error('启动失败，无法获取有效端口：' + err.message)
      throw err
    } else {
      console.log(`----------- 端口 ${availablePort} 可用 --------`)
      process.env.SERVER_PORT = availablePort.toString()
      ipcMain.handle('getPort', () => availablePort)
    }
  })
  
  logger.info('process.cwd:' + process.cwd())
  // logger.info('__dirname:' + __dirname)
  logger.info('process.env.APP_DIR:' + process.env.APP_DIR)
  logger.info('process.env.DB_DATE_BASE:' + process.env.DB_DATE_BASE)
  logger.info('process.env.NODE_ENV:' + process.env.NODE_ENV)
  logger.info('process.env.SERVER_PORT:' + process.env.SERVER_PORT)
  logger.info('process.env.USER_DIR:' + process.env.USER_DIR)
  logger.info('process.env.PUBLIC_DIR:' + process.env.PUBLIC_DIR)
  logger.info('process.env.JWT_SECRET :' + process.env.JWT_SECRET)
  logger.info('getAppPath:' + app.getAppPath())
  logger.info('home:' + app.getPath('home'))
  logger.info('appData:' + app.getPath('appData'))
  logger.info('userData:' + app.getPath('userData'))
  logger.info('sessionData:' + app.getPath('sessionData'))
  logger.info('temp:' + app.getPath('temp'))
  logger.info('exe:' + app.getPath('exe'))
  logger.info('module:' + app.getPath('module'))
  logger.info('desktop:' + app.getPath('desktop'))
  logger.info('documents:' + app.getPath('documents'))
  logger.info('crashDumps:' + app.getPath('crashDumps'))
}
