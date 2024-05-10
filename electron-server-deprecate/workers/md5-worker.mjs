// worker.ts

import { parentPort, workerData } from 'worker_threads'
import * as fs from 'fs'
import * as crypto from 'crypto'

if (!workerData || !workerData.filePath) {
  throw new Error('File path is required.')
}

const filePath = workerData.filePath

function calculateFileStats(filePath) {
  const data = fs.readFileSync(filePath)
  const md5 = crypto.createHash('md5').update(data).digest('hex')
  const size = fs.statSync(filePath).size
  return { md5, size }
}

try {
  const fileStats = calculateFileStats(filePath)
  parentPort?.postMessage(fileStats)
} catch (error) {
  parentPort?.postMessage({ error: error.message })
}
