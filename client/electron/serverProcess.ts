import { type UtilityProcess, utilityProcess, app } from 'electron'
import path from 'node:path'
let serverProcess: null | UtilityProcess = null
// const __rootdirname = process.cwd()
export function initServerProcess() {
  // process.env.NODE_ENV = 'development'
  const serverPath = path.join(app.getAppPath(), 'server', 'server.cjs')
  // console.log(app.getAppPath())

  serverProcess = utilityProcess.fork(serverPath, [], {
    stdio: 'pipe'
  })
  
  serverProcess.on?.('spawn', () => {
    serverProcess?.stdout?.on('data', data => {
      console.log(`serverProcess output: ${data}`)
    })
    serverProcess?.stderr?.on('data', data => {
      console.error(`serverProcess err: ${data}`)
    })
  })
}

export function quitServerProcess() {
  serverProcess?.kill()
}
