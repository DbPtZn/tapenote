import sherpa_onnx from 'sherpa-onnx-node'
import { parentPort, workerData } from 'worker_threads'

const { filepath, config } = workerData

try {
  // console.log('asr-workers')
  const recognizer = new sherpa_onnx.OfflineRecognizer(config)
  // console.log('Started')
  // const start = Date.now()
  const stream = recognizer.createStream()
  let wave
  try {
    wave = sherpa_onnx.readWave(filepath)
  } catch (error) {
    // console.log('readwave error')
    console.log(error)
    throw error
  }

  try {
    stream.acceptWaveform({ sampleRate: wave.sampleRate, samples: wave.samples })
  } catch (error) {
    // console.log('acceptWaveform error')
    console.log(error)
    throw error
  }
 

  recognizer.decode(stream)
  const result = recognizer.getResult(stream)
  // const stop = Date.now()
  // console.log('Done')

  // const elapsed_seconds = (stop - start) / 1000
  // const duration = wave.samples.length / wave.sampleRate
  // const real_time_factor = elapsed_seconds / duration

  // console.log('Wave duration', duration.toFixed(3), 'secodns')
  // console.log('Elapsed', elapsed_seconds.toFixed(3), 'secodns')
  // console.log(`RTF = ${elapsed_seconds.toFixed(3)}/${duration.toFixed(3)} =`, real_time_factor.toFixed(3))
  // console.log(filepath)
  // console.log('result\n', result)

  parentPort.postMessage(result)
} catch (error) {
  parentPort.postMessage({ error: error.message })
}
// 注意: 如果在 worker 内捕获了错误，就无法自动触发主线程的 worker.on('error') 了
