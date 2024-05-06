// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Worker } = require('worker_threads')

function tts(txt) {
  const config = {
    offlineTtsModelConfig: {
      offlineTtsVitsModelConfig: {
        model: '../sherpa/vits-zh-hf-fanchen-C/vits-zh-hf-fanchen-C.onnx',
        lexicon: '../sherpa/vits-zh-hf-fanchen-C/lexicon.txt',
        tokens: '../sherpa/vits-zh-hf-fanchen-C/tokens.txt',
        dataDir: '',
        noiseScale: 0.667,
        noiseScaleW: 0.8,
        lengthScale: 1.0
      },
      numThreads: 1,
      debug: 1,
      provider: 'cpu'
    },
    ruleFsts: [
      '../sherpa/vits-zh-hf-fanchen-C/phone.fst',
      '../sherpa/vits-zh-hf-fanchen-C/number.fst',
      '../sherpa/vits-zh-hf-fanchen-C/new_heteronym.fst'
    ].join(','),
    ruleFars: '',
    maxNumSentences: 1
  }

  const worker = new Worker('./tts-worker.mjs', {
    workerData: {
      txt,
      filepath: './tts-audio/test.wav',
      speakerId: 10,
      speed: 1,
      config
    }
  })
  worker.on('message', msg => {
    console.log(msg)
  })
  worker.on('error', error => {
    console.log('接收到子线程返回的错误：-----------------------------------------')
    console.log(error)
  })
}

tts('好好好！我想先去尿尿！')

// const config = {
//   offlineTtsModelConfig: {
//     offlineTtsVitsModelConfig: {
//       model: '../sherpa/vits-zh-hf-fanchen-C/vits-aishell3.onnx',
//       lexicon: '../sherpa/vits-zh-hf-fanchen-C/lexicon.txt',
//       tokens: '../sherpa/vits-zh-hf-fanchen-C/tokens.txt',
//       dataDir: '',
//       noiseScale: 0.667,
//       noiseScaleW: 0.8,
//       lengthScale: 1.0
//     },
//     numThreads: 1,
//     debug: 1,
//     provider: 'cpu'
//   },
//   ruleFsts: [
//     '../sherpa/vits-zh-hf-fanchen-C/phone.fst',
//     '../sherpa/vits-zh-hf-fanchen-C/number.fst',
//     '../sherpa/vits-zh-hf-fanchen-C/new_heteronym.fst'
//   ].join(','),
//   ruleFars: '../sherpa/vits-zh-hf-fanchen-C/rule.far',
//   maxNumSentences: 1
// }