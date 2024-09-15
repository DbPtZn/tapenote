import { UtilityProcess, app, utilityProcess } from 'electron'
import { logger } from './services'
import path from 'node:path'
import { Worker } from 'worker_threads'
let worker: Worker | null = null
let serverProcess: UtilityProcess | null = null
export function initServerProcess() {
  logger.info('启动本地后台服务')

  // console.log(app.getAppPath())
  // const workerPath = path.join(path.dirname(app.getAppPath()), 'server', 'server.cjs')
  const workerPath = path.join(process.cwd(), 'server', 'server.cjs')
  logger.info('workerPath:' + workerPath)
  worker = new Worker(workerPath, {
    stderr: true,
    stdout: true
  })
  worker.on('message', message => {
    // console.log(`server message: ${message}`)
    logger.info(`server message: ${JSON.stringify(message)}`)
  })
  worker.on('error', error => {
    // console.log(`server error: ${error}`)
    logger.error(`server error: ${error}`)
  })
  // 监听来自 Worker 的 stdout 输出
  worker.stdout.on('data', data => {
    // console.log(`server stdout: ${data}`)
    logger.info(`server stdout: ${data}`)
  })
  worker.stderr.on('error', error => {
    // console.log(`server stderr: ${error}`)
    logger.info(`server stderr: ${error}`)
  })
  // worker.on('stderr', error => {
  //   console.log(`serverProcess4 output: ${error}`)
  //   logger.error(`serverProcess4 output: ${error}`)
  // })

  // const serverPath = path.join(path.dirname(app.getAppPath()), 'server', 'server.cjs')
  // const serverPath = path.join(process.cwd(), 'server', 'server.cjs')
  // serverProcess = utilityProcess.fork(serverPath, [], { stdio: 'pipe' })
  
  // serverProcess.on?.('spawn', () => {
  //   serverProcess?.stdout?.on('data', data => {
  //     // console.log(`serverProcess output: ${data}`)
  //     logger.info(`serverProcess output: ${data}`)
  //   })
  //   serverProcess?.stderr?.on('error', err => {
  //     // console.error(`serverProcess err: ${data}`)
  //     logger.error(`serverProcess output: ${err}`)
  //   })
  // })
}

export function quitServerProcess() {
  worker?.terminate()
  // serverProcess?.kill()
}
