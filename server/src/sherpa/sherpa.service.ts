import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { sherpaDevConfig } from '../config'
import { Worker } from 'worker_threads'
import sherpa_onnx from 'sherpa-onnx-node'

interface RecognizerResult {
  text: string
  tokens: string[]
  timestamps: number[]
}

@Injectable()
export class SherpaService {
  recognizer: any
  stream: any
  regex: RegExp
  constructor(
    @Inject(sherpaDevConfig.KEY)
    private sherpaConfig: ConfigType<typeof sherpaDevConfig>
  ) {
    this.regex = /[!"#\$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~！￥…（）、—【】‘；：”“’。，？]/
    // const audio =
    //   'C:\\Users\\admin\\Desktop\\tapenote\\server\\assets\\public\\IM3Sl1fm\\z5bYeQqU\\audio\\ce783e5c-0e85-4e65-bd10-f8e5810c4f98.wav'
    // this.asr(audio).then(result => {
    //   this.addPunct(result.text).then(puntxt => {
    //     console.log(puntxt)
    //     this.align(puntxt, result)
    //   })
    // })
    const punText = '你知道 are you ok 这句话吗？'
    const result = {
      text: '你知道 are you ok 这句话吗',
      tokens: ['你', '知', '道', 'are', 'you', 'o', 'k', '这', '句', '话', '吗'],
      timestamps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
    console.log(this.align(punText, result))
    // TODO 继续加工 punText，先数组化 punText，再对其中的英文单词进行合并
  }

  asr(filepath: string) {
    return new Promise<RecognizerResult>((resolve, reject) => {
      const config = this.sherpaConfig.offline.asrConfig
      const worker = new Worker('./workers/asr-worker.mjs', {
        workerData: {
          filepath,
          config
        }
      })
      worker.on('message', message => {
        console.log('接收到子线程返回的结果：-----------------------------------------')
        worker.terminate()
        resolve(message)
      })
      worker.on('error', error => {
        console.log('接收到子线程返回的错误：-----------------------------------------')
        console.log(error)
        worker.terminate()
        reject(error)
      })
    })
  }

  tts(txt: string, filepath: string, speakerId?: number, speed?: number) {
    return new Promise<string>((resolve, reject) => {
      const config = this.sherpaConfig.offline.ttsConfig
      const worker = new Worker('./workers/tts-worker.mjs', {
        workerData: {
          txt,
          filepath,
          speakerId,
          speed,
          config
        }
      })
      worker.on('message', message => {
        console.log('接收到子线程返回的结果：-----------------------------------------')
        worker.terminate()
        resolve(message)
      })
      worker.on('error', error => {
        console.log('接收到子线程返回的错误：-----------------------------------------')
        console.log(error)
        worker.terminate()
        reject(error)
      })
    })
  }

  addPunct(txt: string) {
    return new Promise<string>((resolve, reject) => {
      try {
        const config = this.sherpaConfig.offline.punctConfig
        const worker = new Worker('./workers/punct-worker.mjs', {
          workerData: {
            txt,
            config
          }
        })
        worker.on('message', message => {
          console.log('接收到子线程返回的结果：-----------------------------------------')
          worker.terminate()
          const punText = this.normalization(message, txt)
          resolve(punText)
        })
        worker.on('error', error => {
          console.log('接收到子线程返回的错误：-----------------------------------------')
          console.log(error)
          worker.terminate()
          reject(error)
        })
      } catch (error) {
        throw error
      }
    })
  }

  align(punText: string, asrResult: { text: string; tokens: string[]; timestamps: number[] }) {
    const regex = /[!"#\$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~！￥…（）、—【】‘；：”“’。，？\s]/
    const data = asrResult
    // eslint-disable-next-line prefer-const
    let { text, tokens, timestamps } = data
    tokens = tokens.map(token => {
      if (token.includes('@')) {
        const txt = token
          .split('')
          .filter(char => char !== '@')
          .join('')
        return txt
      }
      return token
    })
    if (this.checkPunText(punText, data)) {
      const punTextArr = Array.from(punText)
      console.log(tokens)
      console.log(punTextArr)
      for (let i = 0; i < punTextArr.length; i++) {
        if (tokens.length === 1) {
          if (tokens[i] !== punTextArr[i]) {
            if (regex.test(punTextArr[i])) {
              console.log('插入标点符号：' + punTextArr[i])
              // tokens 插入标点符号
              tokens.splice(i, 0, punTextArr[i])
              // timestamps 插入标点符号时间（取中间值）
              let punTimestamps = 0
              if (timestamps[i] && timestamps[i - 1]) {
                punTimestamps = (timestamps[i] - timestamps[i - 1]) / 2 + timestamps[i - 1]
              } else {
                punTimestamps = timestamps[i - 2] + 0.01
              }
              timestamps.splice(i, 0, Number(Number(punTimestamps).toFixed(3)))

              i--
            }
          }
        }
      }
    } else {
      throw new Error(`添加标点后的文本与原文本无法对齐`)
    }
    console.log(tokens)
    data.text = tokens.join('')
    console.log(data)
    console.log('punText:' + punText.length)
    console.log('txt:' + text.length)
    console.log('tokens:' + tokens.length)
    console.log('timestamps:' + timestamps.length)
    return data
  }

  private normalization(_punText: string, _text: string) {
    let punText = _punText
    let text = _text
    const punctNum = countPunctuation(punText) // 标点符号数量
    const finalLength = text.length + punctNum // 最终结果的字符长度
    for (let i = 0; i < finalLength; i++) {
      if (punText[i] === undefined && text[i] === undefined) {
        break
      }
      if (punText[i] !== text[i]) {
        if (this.regex.test(punText[i])) {
          console.log('插入标点符号：' + punText[i])
          text = insertAt(text, i, punText[i])
          i--
        }
        if (text[i] === ' ') {
          console.log('插入空格')
          punText = insertAt(punText, i, ' ')
          i--
        }
      }
    }
    console.log(punText)
    console.log(text)
    // TODO 继续加工 punText，先数组化 punText，再对其中的英文单词进行合并
    if (punText === text) return text
    else throw new Error(`文本归一化错误！`)
  }

  // 检查无标点文本和标点文本的文字、tokens文字内容是否一致，tokens 和 timestamps 长度是否一致
  private checkPunText(punText: string, data: { text: string; tokens: string[]; timestamps: number[] }) {
    console.log('punText:' + punText)
    console.log('txt:' + data.text)
    // console.log('punText:' + punText.length)
    const regex = /[!"#\$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~！￥…（）、—【】‘；：”“’。，？]/
    const { text, tokens, timestamps } = data
    const textWithoutPunctuation = Array.from(punText)
      .filter(char => !regex.test(char))
      .join('')
    const tokensText = tokens.join('')
    if (text !== textWithoutPunctuation) {
      console.log(`text 与 清理标点后的文本不一致`)
      console.log(`原文本：` + text)
      console.log(`清理后文本：` + textWithoutPunctuation)
      return false
    }
    if (text.replace(/\s/g, '') !== tokensText) {
      console.log(`text 与 tokensText 不一致`)
      console.log(text)
      console.log(tokensText)
      return false
    }
    if (tokens.length !== timestamps.length) {
      console.log(`tokens 和 timestamps 长度不一致`)
      console.log('tokens:' + tokens.length)
      console.log('timestamps:' + timestamps.length)
      return false
    }
    return true
  }
}

/** 在字符串指定位置插入字符 */
function insertAt(str: string, index: number, insertStr: string) {
  return `${str.slice(0, index)}${insertStr}${str.slice(index)}`
}

/** 计算文本中标点符号数量 */
function countPunctuation(sentence: string) {
  // 定义标点符号的正则表达式
  const regex = /[!"#\$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~！￥…（）、—【】‘；：”“’。，？]/g
  
  // 使用match方法找到所有匹配的标点符号
  const punctuations = sentence.match(regex);
  
  // 返回标点符号的数量，如果没有匹配到则返回0
  return punctuations ? punctuations.length : 0;
}

// addPunct(txt: string) {
//   return new Promise<string>((resolve, reject) => {
//     try {
//       const config = this.sherpaConfig.offline.punctConfig
//       const punct = new sherpa_onnx.Punctuation(config)
//       // console.log(txt)
//       const punct_text = punct.addPunct(txt)
//       // console.log(punct_text)
//       resolve(punct_text)
//     } catch (error) {
//       throw error
//     }
//   })
// }
// asr(filepath: string) {
//   return new Promise<RecognizerResult>((resolve, reject) => {
//     try {
//       const config = this.sherpaConfig.offline.asrConfig
//       const recognizer = new sherpa_onnx.OfflineRecognizer(config)
//       console.log('Started')
//       const start = Date.now()
//       const stream = recognizer.createStream()
//       const wave = sherpa_onnx.readWave(filepath)
//       stream.acceptWaveform({ sampleRate: wave.sampleRate, samples: wave.samples })

//       recognizer.decode(stream)
//       const result = recognizer.getResult(stream)
//       const stop = Date.now()
//       console.log('Done')

//       const elapsed_seconds = (stop - start) / 1000
//       const duration = wave.samples.length / wave.sampleRate
//       const real_time_factor = elapsed_seconds / duration

//       console.log('Wave duration', duration.toFixed(3), 'secodns')
//       console.log('Elapsed', elapsed_seconds.toFixed(3), 'secodns')
//       console.log(`RTF = ${elapsed_seconds.toFixed(3)}/${duration.toFixed(3)} =`, real_time_factor.toFixed(3))
//       console.log(filepath)
//       console.log('result\n', result)

//       this.addPunct(result.text).then(result => {
//         console.log('punct result\n', result)
//       })

//       resolve({ text: result.text, tokens: result.tokens, timestamps: result.timestamps })
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

// tts(txt: string, filepath: string, speakerId?: number, speed?: number) {
//   return new Promise<string>((resolve, reject) => {
//     try {
//       const config = this.sherpaConfig.offline.ttsConfig
//       // console.log(config)
//       const tts = new sherpa_onnx.OfflineTts(config)

//       const start = Date.now()
//       const audio = tts.generate({ text: txt, sid: 88, speed: 1.0 })
//       const stop = Date.now()
//       const elapsed_seconds = (stop - start) / 1000
//       const duration = audio.samples.length / audio.sampleRate
//       const real_time_factor = elapsed_seconds / duration

//       console.log('Wave duration', duration.toFixed(3), 'secodns')
//       console.log('Elapsed', elapsed_seconds.toFixed(3), 'secodns')
//       console.log(`RTF = ${elapsed_seconds.toFixed(3)}/${duration.toFixed(3)} =`, real_time_factor.toFixed(3))

//       sherpa_onnx.writeWave(filepath, { samples: audio.samples, sampleRate: audio.sampleRate })

//       console.log(`Saved to ${filepath}`)
//       resolve(filepath)
//     } catch (error) {
//       reject(error)
//     }
//   })
// }
// asr(filepath: string) {
//   return new Promise<RecognizerResult>((resolve, reject) => {
//     const config = this.sherpaConfig.offline.asrConfig
//     const recognizer = sherpa_onnx.createOfflineRecognizer(config)
//     const stream = recognizer.createStream()

//     const waveFilename = filepath

//     const reader = new wav.Reader()
//     const readable = new Readable().wrap(reader)
//     const buf = []

//     reader.on('format', ({ audioFormat, bitDepth, channels, sampleRate }) => {
//       if (sampleRate != recognizer.config.featConfig.sampleRate) {
//         throw new Error(`Only support sampleRate ${recognizer.config.featConfig.sampleRate}. Given ${sampleRate}`)
//       }

//       if (audioFormat != 1) {
//         throw new Error(`Only support PCM format. Given ${audioFormat}`)
//       }

//       if (channels != 1) {
//         throw new Error(`Only a single channel. Given ${channels}`)
//       }

//       if (bitDepth != 16) {
//         throw new Error(`Only support 16-bit samples. Given ${bitDepth}`)
//       }
//     })

//     fs.createReadStream(waveFilename, { highWaterMark: 4096 })
//       .pipe(reader)
//       .on('finish', function (err) {
//         // tail padding
//         const floatSamples = new Float32Array(recognizer.config.featConfig.sampleRate * 0.5)

//         buf.push(floatSamples)
//         const flattened = Float32Array.from(buf.reduce((a, b) => [...a, ...b], []))

//         stream.acceptWaveform(recognizer.config.featConfig.sampleRate, flattened)
//         recognizer.decode(stream)

//         /** getTimestamps */
//         const r = recognizer.Module._GetOfflineStreamResult(stream.handle)
//         // 读取 tokens 值
//         // const tokensPtr = recognizer.Module.getValue(r + 4, 'i8*')
//         // const tokens = recognizer.Module.UTF8ToString(tokensPtr)
//         // console.log('tokens')
//         // console.log(tokens)
//         // const tokensArrPtr = recognizer.Module.getValue(r + 8, 'i8**');
//         // const tokensArr = []
//         // let i = 0
//         // while (true) {
//         //   const tokenPtr = recognizer.Module.getValue(tokensArrPtr + i * 4, 'i8*')
//         //   if (tokenPtr === 0) break
//         //   const token = recognizer.Module.UTF8ToString(tokenPtr)
//         //   tokensArr.push(token)
//         //   i++
//         // }
//         // console.log('tokenPtr')
//         // console.log(tokensArr)
//         // // 读取 timestamps 数组的指针
//         // const timestampsPtr = recognizer.Module.getValue(r + 12, 'i8*')
//         // console.log(timestampsPtr)
//         // // 读取 count 值
//         // const count = recognizer.Module.getValue(r + 16, 'i32')
//         // console.log(count)
//         // // 将指针解引用为浮点数数组
//         // const timestamps = new Float32Array(count)
//         // for (let k = 0; k < count; ++k) {
//         //   console.log(k)
//         //   timestamps[k] = recognizer.Module.HEAPF32[timestampsPtr / 4 + k]
//         // }
//         // console.log(timestamps)
//         // const text = recognizer.getResult(stream)

//         //  读取 json 值
//         const jsonPtr = recognizer.Module.getValue(r + 20, 'i8*')
//         const json = recognizer.Module.UTF8ToString(jsonPtr)
//         // console.log(json)
//         resolve(JSON.parse(json))
//         // 释放内存
//         stream.free()
//         recognizer.free()
//       })

//     readable.on('readable', function () {
//       let chunk: { buffer: ArrayBufferLike; byteOffset: number; length: number }
//       while ((chunk = readable.read()) != null) {
//         const int16Samples = new Int16Array(
//           chunk.buffer,
//           chunk.byteOffset,
//           chunk.length / Int16Array.BYTES_PER_ELEMENT
//         )

//         const floatSamples = new Float32Array(int16Samples.length)
//         for (let i = 0; i < floatSamples.length; i++) {
//           floatSamples[i] = int16Samples[i] / 32768.0
//         }

//         buf.push(floatSamples)
//       }
//     })
//   })
// }

// async tts(txt: string, filepath: string, speakerId?: number, speed?: number) {
//   return new Promise<string>((resolve, reject) => {
//     const config = this.sherpaConfig.offline.ttsConfig
//     const tts = sherpa_onnx.createOfflineTts(config)
//     try {
//       const _speakerId = speakerId || 0
//       const _speed = speed || 1
//       const audio = tts.generate({ text: txt, sid: _speakerId, speed: _speed })
//       // console.log(audio)
//       tts.save(filepath, audio)
//       resolve(filepath)
//       // console.log('Saved to test-zh.wav successfully.')
//       tts.free()
//     } catch (error) {
//       tts.free()
//       reject(error)
//     }
//   })
// }
// private createOfflineTts() {
//   const offlineTtsVitsModelConfig = {
//     model: 'sherpa//vits-zh-hf-fanchen-C/vits-zh-hf-fanchen-C.onnx',
//     lexicon: 'sherpa/vits-zh-hf-fanchen-C/lexicon.txt',
//     tokens: 'sherpa/vits-zh-hf-fanchen-C/tokens.txt',
//     dataDir: '',
//     noiseScale: 0.667,
//     noiseScaleW: 0.8,
//     lengthScale: 1.0
//   }
//   const offlineTtsModelConfig = {
//     offlineTtsVitsModelConfig: offlineTtsVitsModelConfig,
//     numThreads: 1,
//     debug: 1,
//     provider: 'cpu'
//   }
//   const offlineTtsConfig = {
//     offlineTtsModelConfig: offlineTtsModelConfig,
//     ruleFsts: 'sherpa/vits-zh-hf-fanchen-C/rule.fst',
//     maxNumSentences: 1
//   }

//   return sherpa_onnx.createOfflineTts(offlineTtsConfig)
// }

// private createOfflineRecognizer() {
//   const featConfig = {
//     sampleRate: 16000,
//     featureDim: 80
//   }

//   const modelConfig = {
//     transducer: {
//       encoder: '',
//       decoder: '',
//       joiner: ''
//     },
//     paraformer: {
//       model: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/model.int8.onnx'
//     },
//     nemoCtc: {
//       model: ''
//     },
//     whisper: {
//       encoder: '',
//       decoder: '',
//       language: '',
//       task: ''
//     },
//     tdnn: {
//       model: ''
//     },
//     tokens: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/tokens.txt',
//     numThreads: 1,
//     debug: 0,
//     provider: 'cpu',
//     modelType: 'paraformer'
//   }

//   const lmConfig = {
//     model: '',
//     scale: 1.0
//   }

//   const config = {
//     featConfig: featConfig,
//     modelConfig: modelConfig,
//     lmConfig: lmConfig,
//     decodingMethod: 'greedy_search',
//     maxActivePaths: 4,
//     hotwordsFile: '',
//     hotwordsScore: 1.5
//   }
//   return sherpa_onnx.createOfflineRecognizer(config)
// }
/**
getTimestamps(stream) {
  const r = this.Module._GetOfflineStreamResult(stream.handle);

  // 读取 timestamps 数组的指针
  const timestampsPtr = this.Module.getValue(r + 4, 'i8*');
  console.log('timestampsPtr' + timestampsPtr)

  // 读取 count 值
  const count = this.Module.getValue(r + 8, 'i32');
  console.log('count' + count)

  // 将指针解引用为浮点数数组
  const timestamps = new Float32Array(count);
  for (let k = 0; k < count; ++k) {
    timestamps[k] = this.Module.HEAPF32[timestampsPtr/4 + k];
  }
  // const timestamps = new Float32Array(this.Module.HEAPF32.buffer, timestampsPtr, count);
  console.log(timestamps)

  // 将浮点数数组转换为 JavaScript 数组
  // const timestampsArray = Array.from(timestamps);

  // console.log('timestampsArray:')
  // console.log(timestampsArray)

  this.Module._DestroyOfflineRecognizerResult(r);
  // return timestampsArray;
  return timestamps
}
function createNcnnRecognizer() {
  const modelConfig = {
    encoderParam: 'sherpa/sherpa-ncnn-streaming-zipformer-bilingual-zh-en-2023-02-13/encoder_jit_trace-pnnx.ncnn.param',
    encoderBin: 'sherpa/sherpa-ncnn-streaming-zipformer-bilingual-zh-en-2023-02-13/encoder_jit_trace-pnnx.ncnn.bin',
    decoderParam: 'sherpa/sherpa-ncnn-streaming-zipformer-bilingual-zh-en-2023-02-13/decoder_jit_trace-pnnx.ncnn.param',
    decoderBin: 'sherpa/sherpa-ncnn-streaming-zipformer-bilingual-zh-en-2023-02-13/decoder_jit_trace-pnnx.ncnn.bin',
    joinerParam: 'sherpa/sherpa-ncnn-streaming-zipformer-bilingual-zh-en-2023-02-13/joiner_jit_trace-pnnx.ncnn.param',
    joinerBin: 'sherpa/sherpa-ncnn-streaming-zipformer-bilingual-zh-en-2023-02-13/joiner_jit_trace-pnnx.ncnn.bin',
    tokens: 'sherpa/sherpa-ncnn-streaming-zipformer-bilingual-zh-en-2023-02-13/tokens.txt',
    useVulkanCompute: 0,
    numThreads: 1
  }

  const decoderConfig = {
    decodingMethod: 'greedy_search',
    numActivePaths: 4
  }

  const featConfig = {
    samplingRate: 16000,
    featureDim: 80
  }

  const config = {
    featConfig: featConfig,
    modelConfig: modelConfig,
    decoderConfig: decoderConfig,
    enableEndpoint: 1,
    rule1MinTrailingSilence: 1.2,
    rule2MinTrailingSilence: 2.4,
    rule3MinUtternceLength: 20
  }

  return sherpa_ncnn.createRecognizer(config)
}
  asrByNcnn(filepath: string) {
    return new Promise<string>((resolve, reject) => {
      this.recognizer = createNcnnRecognizer()
      this.stream = this.recognizer.createStream()
      const reader = new wav.Reader()
      const readable = new Readable().wrap(reader)
      const buf = []
      const stream = this.stream
      const recognizer = this.recognizer
      reader.on('format', ({ audioFormat, bitDepth, channels, sampleRate }) => {
        if (sampleRate != recognizer.config.featConfig.samplingRate) {
          throw new Error(`Only support sampleRate ${recognizer.config.featConfig.samplingRate}. Given ${sampleRate}`)
        }

        if (audioFormat != 1) {
          throw new Error(`Only support PCM format. Given ${audioFormat}`)
        }

        if (channels != 1) {
          throw new Error(`Only a single channel. Given ${channels}`)
        }

        if (bitDepth != 16) {
          throw new Error(`Only support 16-bit samples. Given ${bitDepth}`)
        }
      })

      fs.createReadStream(filepath, { highWaterMark: 4096 })
        .pipe(reader)
        .on('finish', function (err) {
          // tail padding
          const floatSamples = new Float32Array(recognizer.config.featConfig.samplingRate * 0.5)

          buf.push(floatSamples)
          const flattened = Float32Array.from(buf.reduce((a, b) => [...a, ...b], []))

          stream.acceptWaveform(recognizer.config.featConfig.samplingRate, flattened)
          while (recognizer.isReady(stream)) {
            recognizer.decode(stream)
          }
          const r = recognizer.getResult(stream)
          console.log('result:', r)
          resolve(r)
          console.log('释放内存')
          stream.free()
          recognizer.free()
        })

      readable.on('readable', function () {
        let chunk: { buffer: ArrayBufferLike; byteOffset: number; length: number }
        while ((chunk = readable.read()) != null) {
          const int16Samples = new Int16Array(
            chunk.buffer,
            chunk.byteOffset,
            chunk.length / Int16Array.BYTES_PER_ELEMENT
          )

          const floatSamples = new Float32Array(int16Samples.length)
          for (let i = 0; i < floatSamples.length; i++) {
            floatSamples[i] = int16Samples[i] / 32768.0
          }

          buf.push(floatSamples)
        }
      })
    })
  }
*/
