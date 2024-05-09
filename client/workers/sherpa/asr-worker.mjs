import sherpa_onnx from './index.js'
import wav from 'wav'
import fs from 'fs'
import { Readable } from 'stream'

// const { filepath, config } = workerData
// console.log(config)
process.on('message', msg => {
  const { filepath, config } = msg
  try {
    const recognizer = sherpa_onnx.createOfflineRecognizer(config)
    // console.log('recognizer')
    // console.log(recognizer)
    const stream = recognizer.createStream()
    const waveFilename = filepath

    const reader = new wav.Reader()
    const readable = new Readable().wrap(reader)
    const buf = []

    reader.on('format', ({ audioFormat, bitDepth, channels, sampleRate }) => {
      if (sampleRate != recognizer.config.featConfig.sampleRate) {
        throw new Error(`Only support sampleRate ${recognizer.config.featConfig.sampleRate}. Given ${sampleRate}`)
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

    fs.createReadStream(waveFilename, { highWaterMark: 4096 })
      .pipe(reader)
      .on('finish', function (err) {
        // tail padding
        const floatSamples = new Float32Array(recognizer.config.featConfig.sampleRate * 0.5)

        buf.push(floatSamples)
        const flattened = Float32Array.from(buf.reduce((a, b) => [...a, ...b], []))

        stream.acceptWaveform(recognizer.config.featConfig.sampleRate, flattened)
        recognizer.decode(stream)

        /** getTimestamps */
        const r = recognizer.Module._GetOfflineStreamResult(stream.handle)
        // console.log('r')
        // console.log(r)
        // 读取 tokens 值
        // const tokensPtr = recognizer.Module.getValue(r + 4, 'i8*')
        // const tokens = recognizer.Module.UTF8ToString(tokensPtr)
        // console.log('tokens')
        // console.log(tokens)
        // const tokensArrPtr = recognizer.Module.getValue(r + 8, 'i8**');
        // const tokensArr = []
        // let i = 0
        // while (true) {
        //   const tokenPtr = recognizer.Module.getValue(tokensArrPtr + i * 4, 'i8*')
        //   if (tokenPtr === 0) break
        //   const token = recognizer.Module.UTF8ToString(tokenPtr)
        //   tokensArr.push(token)
        //   i++
        // }
        // console.log('tokenPtr')
        // console.log(tokensArr)
        // // 读取 timestamps 数组的指针
        // const timestampsPtr = recognizer.Module.getValue(r + 12, 'i8*')
        // console.log(timestampsPtr)
        // // 读取 count 值
        // const count = recognizer.Module.getValue(r + 16, 'i32')
        // console.log(count)
        // // 将指针解引用为浮点数数组
        // const timestamps = new Float32Array(count)
        // for (let k = 0; k < count; ++k) {
        //   console.log(k)
        //   timestamps[k] = recognizer.Module.HEAPF32[timestampsPtr / 4 + k]
        // }
        // console.log(timestamps)
        // const text = recognizer.getResult(stream)
        // console.log(text)
        //  读取 json 值
        const jsonPtr = recognizer.Module.getValue(r + 12, 'i8*')
        const json = recognizer.Module.UTF8ToString(jsonPtr)
        console.log(json)
        const result = JSON.parse(json)
        // usePunctuation(result.text)
        // 将结果发送回主线程
        process.send(result)
        // 释放内存
        stream.free()
        recognizer.free()
      })

    readable.on('readable', function () {
      let chunk // { buffer: ArrayBufferLike; byteOffset: number; length: number }
      while ((chunk = readable.read()) != null) {
        const int16Samples = new Int16Array(chunk.buffer, chunk.byteOffset, chunk.length / Int16Array.BYTES_PER_ELEMENT)

        const floatSamples = new Float32Array(int16Samples.length)
        for (let i = 0; i < floatSamples.length; i++) {
          floatSamples[i] = int16Samples[i] / 32768.0
        }

        buf.push(floatSamples)
      }
    })
  } catch (error) {
    process.send({ error: error.message })
  }
})

// 注意: 如果在 worker 内捕获了错误，就无法自动触发主线程的 worker.on('error') 了

// function usePunctuation(text) {
//   const model = '../sherpa/sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12/model.onnx'
//   if (!fs.existsSync(model)) {
//     throw new Error(`${model} does not exist`)
//   }
//   // const config = sherpa_onnx.OfflinePunctuationConfig({
//   //   model: sherpa_onnx.OfflinePunctuationModelConfig({
//   //     ct_transformer: model
//   //   })
//   // })

//   // const punct = sherpa_onnx.OfflinePunctuation(config)
//   // const result = punct.usePunctuation(text)
//   // console.log(result)
//   // return result
// }
