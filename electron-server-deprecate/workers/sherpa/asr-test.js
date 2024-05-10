/* eslint-disable prettier/prettier */
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

// asr('C:/Users/26184/Desktop/tapenote/server/sherpa/sherpa-onnx-paraformer-zh-2023-09-14/test_wavs/1.wav')
asr('C:/Users/admin/Desktop/tapenote/server/public/uWgrfCru/audio/6614e12fba64241ae4c33b96.wav')
const data = {
  text: '重点呢想谈三个问题首先呢就是这一轮全球金融动荡的表现',
  punText:'重点呢,想谈三个问题,首先呢,就是这一轮全球金融动荡的表现。',
  timestamps: [
    0.16,  0.3, 0.42, 0.56, 0.72,
    0.96, 1.08,  1.2,  1.3, 2.08,
    2.26, 2.44, 2.58, 2.72, 2.98,
    3.14, 3.26, 3.46, 3.62,  3.8,
    3.88,    4,  4.1,  4.2, 4.36,
    4.56
  ],
  tokens: [
    '重', '点', '呢', '想', '谈',
    '三', '个', '问', '题', '首',
    '先', '呢', '就', '是', '这',
    '一', '轮', '全', '球', '金',
    '融', '动', '荡', '的', '表',
    '现'
  ],
}

const regex = /[!"#\$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~！￥…（）、—【】‘；：”“’。，？]/g;
// 检查无标点文本和标点文本的文字、tokens文字内容是否一致，tokens 和 timestamps 长度是否一致
function checkPunText (text, punText, tokens, timestamps) {
  const textWithoutPunctuation = Array.from(data.punText).filter(char => !regex.test(char)).join('')
  const tokensText = tokens.join('')
  if (text === textWithoutPunctuation && text === tokensText && tokens.length === timestamps.length) return true
  else return false
}
// console.log(checkPunText(data.text, data.punText, data.tokens, data.timestamps))
// function findPunctuation(text) {

//   const punctuationList = text.match(regex);
//   return punctuationList || [];
// }
// Array.from(data.text).forEach((char, index) => {
//   console.log(char, data.timestamps[index])
// })
// console.log(findPunctuation(data.punText))
if (checkPunText(data.text, data.punText, data.tokens, data.timestamps)) {
  const punTextArr = Array.from(data.punText)
  for (let i = 0; i < punTextArr.length; i++) {
    if (data.tokens[i] !== punTextArr[i]) {
      if (regex.test(punTextArr[i])) {
        // tokens 插入标点符号
        data.tokens.splice(i, 0, punTextArr[i])

        // timestamps 插入标点符号时间（取中间值）
        let punTimestamps = 0
        if (data.timestamps[i] && data.timestamps[i - 1]) {
          punTimestamps = (data.timestamps[i] - data.timestamps[i - 1]) / 2 + data.timestamps[i - 1]
        } else {
          punTimestamps = data.timestamps[i - 2] + 0.01
        }
        data.timestamps.splice(i, 0, Number(Number(punTimestamps).toFixed(3)))

        i--
      }
    }
  }
}
// console.log(data.tokens)
// console.log(data.timestamps)