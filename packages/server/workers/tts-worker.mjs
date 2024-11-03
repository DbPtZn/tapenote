import sherpa_onnx from 'sherpa-onnx-node'
import { parentPort, workerData } from 'worker_threads'
import fs from 'fs'

const { txt, filepath, speakerId, speed, config } = workerData

try {
  // console.log(filepath)
  // console.log('fs')
  // console.log(fs)
  const tts = new sherpa_onnx.OfflineTts(config)

  const start = Date.now()
  let audio = null
  try {
    audio = tts.generate({ text: txt, sid: speakerId || 88, speed: speed || 1.0 })
  } catch (error) {
    // console.log('生成音频失败！')
    // console.log(error)
    throw error
  }
  const stop = Date.now()
  const elapsed_seconds = (stop - start) / 1000
  const duration = audio.samples.length / audio.sampleRate
  const real_time_factor = elapsed_seconds / duration

  // console.log('Wave duration', duration.toFixed(3), 'secodns')
  // console.log('Elapsed', elapsed_seconds.toFixed(3), 'secodns')
  // console.log(`RTF = ${elapsed_seconds.toFixed(3)}/${duration.toFixed(3)} =`, real_time_factor.toFixed(3))

  try {
    sherpa_onnx.writeWave(filepath, { samples: audio.samples, sampleRate: audio.sampleRate })
  } catch (error) {
    console.log(error)
    // console.log('写入失败！')
    throw error
  }

  console.log(`Saved to ${filepath}`)

  // 将结果发送回主线程
  parentPort.postMessage(true)
} catch (error) {
  parentPort.postMessage({ error: error.message })
}

// 注意: 如果在 worker 内捕获了错误，就无法自动触发主线程的 worker.on('error') 了
