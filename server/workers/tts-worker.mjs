import sherpa_onnx from 'sherpa-onnx-node'

process.on('message', msg => {
  // console.log('message', msg)
  console.log('tts-worker.mjs')
  const { txt, filepath, speakerId, speed, config } = msg
  try {
    const config = this.sherpaConfig.offline.ttsConfig
    // console.log(config)
    const tts = new sherpa_onnx.OfflineTts(config)

    const start = Date.now()
    const audio = tts.generate({ text: txt, sid: 88, speed: 1.0 })
    const stop = Date.now()
    const elapsed_seconds = (stop - start) / 1000
    const duration = audio.samples.length / audio.sampleRate
    const real_time_factor = elapsed_seconds / duration

    console.log('Wave duration', duration.toFixed(3), 'secodns')
    console.log('Elapsed', elapsed_seconds.toFixed(3), 'secodns')
    console.log(`RTF = ${elapsed_seconds.toFixed(3)}/${duration.toFixed(3)} =`, real_time_factor.toFixed(3))

    sherpa_onnx.writeWave(filepath, { samples: audio.samples, sampleRate: audio.sampleRate })

    console.log(`Saved to ${filepath}`)
    process.send(filepath)
  } catch (error) {
    process.send({ error: error.message })
  }
})

// 注意: 如果在 worker 内捕获了错误，就无法自动触发主线程的 worker.on('error') 了
