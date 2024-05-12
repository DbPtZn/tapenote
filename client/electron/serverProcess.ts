import { type UtilityProcess, utilityProcess } from 'electron'
import PouchDB from 'pouchdb-node'
import path from 'node:path'

let serverProcess: null | UtilityProcess = null
const __rootdirname = process.cwd()
export function initServerProcess() {
  // process.env.NODE_ENV = 'development'
  const serverPath = path.join(__rootdirname, '..', 'server', 'process', 'server.js')
  // const serverPath = path.join(__rootdirname, 'workers', 'server', 'server.cjs')
  // console.log(serverPath)
  serverProcess = utilityProcess.fork(serverPath, [], {
    stdio: 'pipe'
  })

  // serverProcess.postMessage('PouchDB')

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
