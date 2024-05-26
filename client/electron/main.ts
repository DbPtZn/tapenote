import { app, BrowserWindow } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { initServerProcess, quitServerProcess } from './serverProcess'
import { type UtilityProcess, utilityProcess } from 'electron'
import child_process from 'child_process'
import { Worker } from 'worker_threads'
// import * as sherpa_onnx from 'sherpa-onnx-node'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      // nodeIntegration: true,
    }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    quitServerProcess()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  initServerProcess()
  // createAsr()
  // createPunctWorker()
  // createAsrWorker()
  // createTtsWorker()
  createWindow()
})
function createPunctWorker() {
  const filepath = path.join(process.cwd(), 'workers', 'punct-worker.mjs')
  const worker = new Worker(filepath, {
    workerData: {
      txt: '当你听到这句话的时候我已经消失了请你不要悼念我',
      config: punctConfig
    }
  })
  worker.on('message', (message: any) => {
    console.log('接收到子线程返回的结果：-----------------------------------------')
    if (message.error) {
      console.log('标点添加发生错误：' + message.error)
    } else {
      console.log('标点添加结果：')
      console.log(message)
      // message.text = message.text.trim()
    }
    worker.terminate()
  })
}

function createAsrWorker() {
  const audiopath = 'C:/Users/admin/Desktop/tapenote/client/assets/public/5wWbTjc3/KucHgdUy/audio/1ad7fe25-3ea9-44e1-b0dc-b98b4462b35d.wav'
  const filepath = path.join(process.cwd(), 'workers', 'asr-worker.mjs')
  const worker = new Worker(filepath, {
    workerData: {
      filepath: audiopath,
      config: asrConfig
    }
  })
  worker.on('message', (message: any) => {
    console.log('接收到子线程返回的结果：-----------------------------------------')
    if (message.error) {
      console.log('语音识别发生错误：' + message.error)
    } else {
      console.log('语音识别结果：')
      console.log(message)
      message.text = message.text.trim()
    }
    worker.terminate()
  })
}

// function createTtsWorker() {
//   const filepath = path.join(process.cwd(), 'workers', 'tts-worker.mjs')
//   const worker = new Worker(filepath, {
//     workerData: {
//       txt: '当你听到这句话的时候我已经消失了请你不要悼念我',
//       filepath: './test.wav',
//       speakerId: 1,
//       speed: 1.0,
//       config: ttsConfig
//     },
//     stdin: true,
//     stdout: true,
//     stderr: true,
//   })
//   worker.on('message', (message: any) => {
//     console.log('接收到子线程返回的结果：-----------------------------------------')
//     if (message.error) {
//       console.log('语音识别发生错误：' + message.error)
//     } else {
//       console.log('语音识别结果：')
//       console.log(message)
//       message.text = message.text.trim()
//     }
//     worker.terminate()
//   })
// }

// function createAsr() {
//   const audiopath = 'C:/Users/admin/Desktop/tapenote/client/assets/public/5wWbTjc3/KucHgdUy/audio/1ad7fe25-3ea9-44e1-b0dc-b98b4462b35d.wav'
//   const recognizer = new sherpa_onnx.OfflineRecognizer(asrConfig)
//   const start = Date.now()

//   let stream
//   try {
//     stream = recognizer.createStream()
//   } catch (error) {
//     console.log('create stream error')
//     throw error
//   }
//   let wave
//   try {
//     wave = sherpa_onnx.readWave(audiopath)
//   } catch (error) {
//     console.log('读取失败')
//     console.log(error)
//     throw error
//   }
//   stream.acceptWaveform({ sampleRate: wave.sampleRate, samples: wave.samples })

//   recognizer.decode(stream)
//   const result = recognizer.getResult(stream)
//   const stop = Date.now()
//   console.log('Done')

//   const elapsed_seconds = (stop - start) / 1000
//   const duration = wave.samples.length / wave.sampleRate
//   const real_time_factor = elapsed_seconds / duration

//   console.log('Wave duration', duration.toFixed(3), 'secodns')
//   console.log('Elapsed', elapsed_seconds.toFixed(3), 'secodns')
//   console.log(`RTF = ${elapsed_seconds.toFixed(3)}/${duration.toFixed(3)} =`, real_time_factor.toFixed(3))
//   console.log('result\n', result)
// }

const ttsConfig = {
  model: {
    vits: {
      model: 'sherpa/vits-zh-hf-fanchen-C/vits-zh-hf-fanchen-C.onnx',
      tokens: 'sherpa/vits-zh-hf-fanchen-C/tokens.txt',
      lexicon: 'sherpa/vits-zh-hf-fanchen-C/lexicon.txt',
      dictDir: 'sherpa/vits-zh-hf-fanchen-C/dict'
    },
    debug: true,
    numThreads: 2,
    provider: 'cpu'
  },
  maxNumStences: 1,
  ruleFsts: [
    'sherpa/vits-zh-hf-fanchen-C/date.fst',
    'sherpa/vits-zh-hf-fanchen-C/phone.fst',
    'sherpa/vits-zh-hf-fanchen-C/number.fst',
    'sherpa/vits-zh-hf-fanchen-C/new_heteronym.fst'
  ].join(','),
  ruleFars: ''
}
const asrConfig = {
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
const punctConfig = {
  model: {
    ctTransformer: 'sherpa/sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12/model.onnx',
    debug: true,
    numThreads: 1,
    provider: 'cpu'
  }
}
