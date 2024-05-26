import { type UtilityProcess, utilityProcess } from 'electron'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import path from 'node:path'
import { Worker } from 'worker_threads'
let serverProcess: null | UtilityProcess = null
// let serverProcess: ChildProcessWithoutNullStreams
// let serverProcess: null | Worker
const __rootdirname = process.cwd()
export function initServerProcess() {
  // process.env.NODE_ENV = 'development'
  // const serverPath = path.join(__rootdirname, '..', 'server', 'process', 'server.cjs')
  // const serverPath = path.join(__rootdirname, 'workers', 'server', 'server.cjs')
  const serverPath = path.join(__rootdirname, 'electron', 'server', 'server.cjs')
  // console.log(serverPath)
 
  // serverProcess = spawn(process.execPath, ['-r', 'worker_threads', serverPath]);

  // serverProcess = new Worker(serverPath)

  // serverProcess.stdout.on('data', (data) => {
  //   console.log(`Worker said: ${data}`);
  // });
  
  // serverProcess.stderr.on('data', (data) => {
  //   console.error(`Worker said: ${data}`);
  // });

  // serverProcess.on('message', msg => {
  //   console.log(msg)
  // })
  
  // serverProcess.on('exit', (code) => {
  //   console.log(`Worker stopped with exit code ${code}`);
  //   serverProcess.kill()
  //   // serverProcess?.terminate()
  // });

  serverProcess = utilityProcess.fork(serverPath, [], {
    stdio: 'pipe',
    allowLoadingUnsignedLibraries: true
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
  // serverProcess?.terminate()
}
