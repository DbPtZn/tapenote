import { type UtilityProcess, utilityProcess } from 'electron'
import path from 'path'

let serverProcess: null | UtilityProcess = null
const __rootdirname = process.cwd()
export function initServerProcess() {
  const serverPath = path.join(__rootdirname, '..', 'electron-server', 'dist', 'main.js')
  console.log(serverPath)
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
