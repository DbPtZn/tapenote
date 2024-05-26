import * as fs from 'fs'
import * as crypto from 'crypto'

process.on('message', msg => {
  console.log('message', msg)
  const filePath = msg.filepath
  try {
    const txt = fs.readFileSync(filePath)
    console.log(txt)
    process.send(txt)
  } catch (error) {
    process.send({ error: error.message })
  }
})
