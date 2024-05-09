// import { parentPort, workerData } from 'worker_threads'
import sherpa_onnx from './index.js'
// import sherpa_onnx from 'sherpa-onnx'

// const { txt, filepath, speakerId, speed, config } = workerData

process.on('message', (msg) => {
  // console.log('message', msg)
  const { txt, filepath, speakerId, speed, config } = msg
  try {
    const tts = sherpa_onnx.createOfflineTts(config)
    const _speakerId = speakerId || 0
    const _speed = speed || 1
    const audio = tts.generate({ text: txt, sid: _speakerId, speed: _speed })
    tts.save(filepath, audio)
    process.send(true) // 返回的消息必须是 JSON 格式
    tts.free()
  } catch (error) {
    process.send({ error: error.message })
  }
})
// 注意: 如果在 worker 内捕获了错误，就无法自动触发主线程的 worker.on('error') 了
