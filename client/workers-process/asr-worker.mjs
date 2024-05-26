import sherpa_onnx from 'sherpa-onnx-node'
import fs from 'fs'

process.on('message', msg => {
  const { filepath, config } = msg
  console.log(msg)
  console.log('asr-workers')
  try {
    const recognizer = new sherpa_onnx.OfflineRecognizer(config)
    console.log('Started')
    const start = Date.now()
    let stream
    try {
      stream = recognizer.createStream()
    } catch (error) {
      console.log('create stream error')
      throw error
    }
    let wave
    try {
      const buffer = fs.readFileSync(filepath)
      wave = sherpa_onnx.readWave(buffer.toString('utf-8'))
    } catch (error) {
      console.log('读取失败')
      console.log(error)
      throw error
    }
    stream.acceptWaveform({ sampleRate: wave.sampleRate, samples: wave.samples })

    recognizer.decode(stream)
    const result = recognizer.getResult(stream)
    const stop = Date.now()
    console.log('Done')

    const elapsed_seconds = (stop - start) / 1000
    const duration = wave.samples.length / wave.sampleRate
    const real_time_factor = elapsed_seconds / duration

    console.log('Wave duration', duration.toFixed(3), 'secodns')
    console.log('Elapsed', elapsed_seconds.toFixed(3), 'secodns')
    console.log(`RTF = ${elapsed_seconds.toFixed(3)}/${duration.toFixed(3)} =`, real_time_factor.toFixed(3))
    console.log(filepath)
    console.log('result\n', result)

    process.send(result)
  } catch (error) {
    process.send({ error: error.message })
  }
})
// 注意: 如果在 worker 内捕获了错误，就无法自动触发主线程的 worker.on('error') 了
