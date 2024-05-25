// calculate md5 and size
import * as fs from 'fs'
import * as crypto from 'crypto'

process.on('message', msg => {
  // console.log('message', msg)
  const filePath = msg
  try {
    const fileStats = calculateFileStats(filePath)
    process.send(fileStats) // 返回的消息必须是 JSON 格式
  } catch (error) {
    process.send({ error: error.message })
  }
})

function calculateFileStats(filePath) {
  const data = fs.readFileSync(filePath)
  const md5 = crypto.createHash('md5').update(data).digest('hex')
  const size = fs.statSync(filePath).size
  return { md5, size }
}
