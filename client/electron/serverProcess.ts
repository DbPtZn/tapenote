import { app, utilityProcess } from 'electron'
import logger from './logService'
import path from 'node:path'
import { Worker } from 'worker_threads'
let worker: Worker | null = null
export function initServerProcess() {
  logger.info('启动本地后台服务')

  // console.log(app.getAppPath())
  // const workerPath = path.join(path.dirname(app.getAppPath()), 'server', 'server.cjs')
  // const workerPath = path.join(app.getAppPath(), 'server', 'server.cjs')
  // logger.info('workerPath:' + workerPath)
  // worker = new Worker(workerPath, {
  //   // stderr: true,
  //   // stdin: true,
  //   // stdout: true
  // })
  // worker.on('message', message => {
  //   logger.info(`serverProcess output: ${message}`)
  // })
  // worker.on('error', error => {
  //   logger.error(`serverProcess output: ${error}`)
  // })
  // // 监听来自 Worker 的 stdout 输出
  // worker.on('stdout', message => {
  //   logger.info(`serverProcess output: ${message}`)
  // })

  // worker.on('stderr', error => {
  //   logger.error(`serverProcess output: ${error}`)
  // })

  // const serverPath = path.join(path.dirname(app.getAppPath()), 'server', 'server.cjs')
  const serverPath = path.join(process.cwd(), 'server', 'server.cjs')
  const serverProcess = utilityProcess.fork(serverPath, [], { stdio: 'pipe' })
  
  serverProcess.on?.('spawn', () => {
    serverProcess?.stdout?.on('data', data => {
      // console.log(`serverProcess output: ${data}`)
      logger.info(`serverProcess output: ${data}`)
    })
    serverProcess?.stderr?.on('error', err => {
      // console.error(`serverProcess err: ${data}`)
      logger.error(`serverProcess output: ${err}`)
    })
  })
}

export function quitServerProcess() {
  worker?.terminate()
}
