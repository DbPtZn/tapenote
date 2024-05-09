import { Inject, Injectable } from '@nestjs/common'
// import fs from 'fs'
// import path, { join } from 'path'
// import wav from 'wav'
// import sherpa_ncnn from 'sherpa-ncnn'
// import sherpa_onnx from 'sherpa-onnx'
// import { Readable } from 'stream'
import { ConfigService, ConfigType } from '@nestjs/config'
import { sherpaDevConfig } from '../config'
// import { Worker } from 'worker_threads'
import child_process from 'child_process'
// import myPlugin from 'build/Release/my_plugin.node'
// // 读取 wasm 模块文件
// import sherpa_onnx from 'wasm'
// let sherpa_onnx: any
// const __rootdirname = process.cwd()
// import(path.resolve(__rootdirname, 'build', 'Release', 'cpp_plugin.node')).then(plugin => {
//   console.log(plugin)
//   console.log(plugin.sayHello())
// })

interface RecognizerResult {
  text: string
  tokens: string[]
  timestamps: number[]
}

@Injectable()
export class SherpaService {
  recognizer: any
  stream: any
  constructor(
    @Inject(sherpaDevConfig.KEY)
    private sherpaConfig: ConfigType<typeof sherpaDevConfig>
  ) {
    // console.log(this.sherpaConfig.offline.asrConfig)
    // index.js
    // const addon = require('./build/Release/addon')
    // console.log(addon.sayHello());
  }
  asr(filepath: string) {
    return new Promise<RecognizerResult>((resolve, reject) => {
      const config = this.sherpaConfig.offline.asrConfig
      const child = child_process.fork('workers/sherpa/asr-worker.mjs')
      child.send({
        filepath,
        config
      })
      // 设置超时 (10s)
      // const timer = setTimeout(() => {
      //   child.kill()
      //   clearTimeout(timer)
      // }, 100000)
      child.on('message', (message: any) => {
        console.log('接收到子线程返回的结果：-----------------------------------------')
        child.kill()
        resolve(message)
      })
      child.on('error', error => {
        console.log('接收到子线程返回的错误：-----------------------------------------')
        console.log(error)
        child.kill()
        reject(error)
      })
    })
  }

  tts(txt: string, filepath: string, speakerId?: number, speed?: number) {
    return new Promise<string>((resolve, reject) => {
      const config = this.sherpaConfig.offline.ttsConfig
      const child = child_process.fork('workers/sherpa/tts-worker.mjs')
      child.send({
        txt,
        filepath,
        speakerId,
        speed,
        config
      })
      child.on('message', (message: any) => {
        console.log('接收到子线程返回的结果：-----------------------------------------')
        resolve(message)
      })
      child.on('error', error => {
        console.log('接收到子线程返回的错误：-----------------------------------------')
        console.log(error)
        reject(error)
      })
    })
  }

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
}

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
