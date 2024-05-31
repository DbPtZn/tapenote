import { type UtilityProcess, utilityProcess, app } from 'electron'
import logger from './logService'
import path from 'node:path'
let serverProcess: null | UtilityProcess = null
import { Worker } from 'worker_threads'
// const __rootdirname = process.cwd()
export function initServerProcess() {
  // process.env.NODE_ENV = 'development'
  logger.info('启动本地后台服务')
  
  // console.log(app.getAppPath())
  const workerPath = path.join(path.dirname(app.getAppPath()), 'server', 'server.cjs')
  logger.info('workerPath:' + workerPath)
  const worker = new Worker(workerPath)
  worker.on('message', (message: any) => {
    console.log('接收到子线程返回的结果：-----------------------------------------')
    if (message.error) {
      logger.error(`serverProcess output: ${message.error}`)
    } else {
      logger.info(`serverProcess output: ${message}`)
    }
  })
  worker.on('error', error => {
    console.log('接收到子线程返回的错误：-----------------------------------------')
    logger.error(`serverProcess output: ${error}`)
  })

 
  const serverPath = path.join(app.getAppPath(), 'server', 'server.cjs')
  serverProcess = utilityProcess.fork(serverPath, [], {
    stdio: 'pipe'
  })

  logger.info('utilityProcess serverPath:' + serverPath)
  serverProcess.on?.('spawn', () => {
    serverProcess?.stdout?.on('data', data => {
      console.log(`serverProcess output: ${data}`)
      logger.info(`serverProcess output: ${data}`)
    })
    serverProcess?.stderr?.on('data', data => {
      console.error(`serverProcess err: ${data}`)
      logger.error(`serverProcess output: ${data}`)
    })
  })


}

export function quitServerProcess() {
  // serverProcess?.kill()
}
