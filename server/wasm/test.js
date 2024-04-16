/* eslint-disable @typescript-eslint/no-var-requires */
const { Worker } = require('worker_threads')
// const sherpa_onnx = require('./index')
// console.log(sherpa_onnx.createOfflinePunctuation())

// return
function asr(filepath) {
  const config = {
    featConfig: {
      sampleRate: 16000,
      featureDim: 80
    },
    modelConfig: {
      transducer: {
        encoder: '',
        decoder: '',
        joiner: ''
      },
      paraformer: {
        model: '../sherpa/sherpa-onnx-paraformer-zh-2023-09-14/model.int8.onnx'
      },
      nemoCtc: {
        model: ''
      },
      whisper: {
        encoder: '',
        decoder: '',
        language: '',
        task: ''
      },
      tdnn: {
        model: ''
      },
      tokens: '../sherpa/sherpa-onnx-paraformer-zh-2023-09-14/tokens.txt',
      numThreads: 1,
      debug: 0,
      provider: 'cpu',
      modelType: 'paraformer'
    },
    lmConfig: {
      model: '',
      scale: 1.0
    },
    decodingMethod: 'greedy_search',
    maxActivePaths: 4,
    hotwordsFile: '',
    hotwordsScore: 1.5
  }

  const worker = new Worker('./asr-worker.mjs', {
    workerData: {
      filepath,
      config
    }
  })
  worker.on('message', message => {
    console.log('接收到子线程返回的结果：-----------------------------------------')
    console.log(message)
  })
  worker.on('error', error => {
    console.log('接收到子线程返回的错误：-----------------------------------------')
    console.log(error)
  })
}

asr('C:/Users/admin/Desktop/tapenote/server/public/MThgz1p5/audio/6613cab46e276704ca126600.wav')
