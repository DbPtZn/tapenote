// console.log(portAudio.getDevices());

import sherpa_onnx from 'sherpa-onnx-node'
import portAudio from 'naudiodon2'
import { parentPort, workerData } from 'worker_threads'

const data = workerData
console.log(data)


try {
  console.log('1.createRecognizer')
  let recognizer
  try {
    recognizer = createRecognizer()
  } catch (error) {
    console.log('recognizer')
    throw error
  }

  console.log('2.createVad')
  let vad
  try {
    vad = createVad()
  } catch (error) {
    console.log('create vad')
    throw error
  }

  console.log('3.new sherpa_onnx.CircularBuffer')
  const bufferSizeInSeconds = 30
  let buffer
  try {
    buffer = new sherpa_onnx.CircularBuffer(bufferSizeInSeconds * vad.config.sampleRate)
  } catch (error) {
    console.log('CircularBuffer')
    throw error
  }

  console.log('4.new portAudio.AudioIO')
  let ai
  try {
    ai = new portAudio.AudioIO({
      inOptions: {
        channelCount: 1,
        closeOnError: true, // Close the stream if an audio error is detected, if
        // set false then just log the error
        deviceId: -1, // Use -1 or omit the deviceId to select the default device
        sampleFormat: portAudio.SampleFormatFloat32,
        sampleRate: vad.config.sampleRate
      }
    })
  } catch (error) {
    console.log('AudioIO' + error)
    throw error
  }

  console.log('5.ai.on')
  let printed = false
  let index = 0
  ai.on('data', data => {
    const windowSize = vad.config.sileroVad.windowSize
    buffer.push(new Float32Array(data.buffer))
    try {
      while (buffer.size() > windowSize) {
        let samples
        try {
          samples = buffer.get(buffer.head(), windowSize, false)
        } catch (error) {
          console.log('buffer.get(buffer.head(), windowSize, false)' + error)
          throw error
        }
        try {
          buffer.pop(windowSize)
        } catch (error) {
          console.log('buffer.pop' + error)
          throw error
        }
        try {
          vad.acceptWaveform(samples)
        } catch (error) {
          console.log('vad.acceptWaveform(samples, false)')
          throw error
        }
      }
    } catch (error) {
      console.log('vad.acceptWaveform' + error)
      throw error
    }

    while (!vad.isEmpty()) {
      try {
        let segment
        try {
          segment = vad.front(false)
        } catch (error) {
          console.log('vad.front(false)' + error)
          throw error
        }
        vad.pop()
        const stream = recognizer.createStream()
        try {
          stream.acceptWaveform({
            samples: segment.samples,
            sampleRate: recognizer.config.featConfig.sampleRate
          })
        } catch (error) {
          console.log('stream.acceptWaveform')
          throw error
        }
        recognizer.decode(stream)
        const r = recognizer.getResult(stream)
        if (r.text.length > 0) {
          const text = r.text.toLowerCase().trim()
          console.log(`${index}: ${text}`)

          const filename = `${index}-${text}-${new Date().toLocaleTimeString('en-US', { hour12: false }).split(' ')[0]}.wav`
          sherpa_onnx.writeWave(filename, { samples: segment.samples, sampleRate: vad.config.sampleRate})

          index += 1
        }
      } catch (error) {
        console.log('vad.front' + error)
        throw error
      }
    }
  })

  ai.start()
  console.log('Started! Please speak')
  parentPort.postMessage('Started! Please speak')
} catch (error) {
  parentPort.postMessage({ error: error.message })
  throw error
}

function createRecognizer() {
  // Please download test files from
  // https://github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models
  const config = {
    featConfig: {
      sampleRate: 16000,
      featureDim: 80
    },
    modelConfig: {
      paraformer: {
        model: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/model.int8.onnx'
      },
      tokens: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/tokens.txt',
      numThreads: 2,
      provider: 'cpu',
      debug: 1
    }
  }
  let recognizer
  try {
    recognizer = new sherpa_onnx.OfflineRecognizer(config)
  } catch (error) {
    console.log('new sherpa_onnx.OfflineRecognizer')
    console.log(error)
    throw error
  }
  return recognizer
}

function createVad() {
  // please download silero_vad.onnx from
  // https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/silero_vad.onnx
  const config = {
    sileroVad: {
      model: 'sherpa/silero_vad.onnx',
      threshold: 0.5,
      minSpeechDuration: 0.25,
      minSilenceDuration: 0.5,
      windowSize: 512
    },
    sampleRate: 16000,
    debug: true,
    numThreads: 1
  }

  const bufferSizeInSeconds = 60

  return new sherpa_onnx.Vad(config, bufferSizeInSeconds)
}
