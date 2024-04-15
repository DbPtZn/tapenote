// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Worker } = require('worker_threads')
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
        model: '../sherpa/sherpa-onnx-punct-ct-transformer-zh-en-2024-04-12/model.onnx'
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
      tokens: '../sherpa/sherpa-onnx-punct-ct-transformer-zh-en-2024-04-12/tokens.json',
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

asr('C:/Users/26184/Desktop/tapenote/server/public/SPolZ2wc/audio/6616c0b4388743de9fd50b5e.wav')
