// TODO 由于 js-audio-recorder 插件的有点过时了，后续考虑替换成新的 api 实现音频录制功能
import { Subject } from '@tanbo/stream'
import { AudioRecorder } from '../_utils/recorder'
import { onMounted, ref, useTemplateRef } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import { useThemeVars } from 'naive-ui'

export function useRecorder() {
  const onRecorderEnd = new Subject<string>()
  const onStateUpdate = new Subject<boolean>()
  const ondataavailable = new Subject<{ blob: Blob; duration: number; isSilence?: boolean }>()

  const themeVars = useThemeVars()
  const waveEl = useTemplateRef<HTMLCanvasElement>('waveEl')

  const isRecording = ref(false)
  const isStarted = ref(false)
  const isWaveformVisible = ref(false)
  const totalDuration = ref(0)
  let timer
  const isAutoCut = ref(true)

  let mediaRecorder: MediaRecorder | null = null
  let audioCtx: AudioContext | null = null
  let stream: MediaStream | null = null
  let audioChunks: Blob[] = []

  let isNewRecorder = false // 是否为新的录音（新录音有个静音等待期）
  let currentDuration = 0
  let startTime = 0
  let pausedTime = 0
  let silentFrameCount = 0

  async function startRecording() {
    init()
    isStarted.value = true

    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        sampleSize: 16,
        channelCount: 1
      },
      video: false
    })

    timer = setInterval(() => {
      totalDuration.value += 0.01
    }, 10)

    currentDuration = 0
    startTime = 0
    pausedTime = 0

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    audioChunks = [] // 重置音频块

    mediaRecorder.ondataavailable = async event => {
      if (event.data.size > 0) {
        // console.log('add chunk', event, '音频数据块的大小（MB）:', event.data.size / (1024 * 1024))
        const endTime = Date.now()
        currentDuration += (endTime - startTime) / 1000
        startTime = Date.now()

        audioChunks.push(event.data)
      }
    }

    mediaRecorder.onstart = () => {
      startTime = Date.now() // 记录开始时间
    }

    mediaRecorder.onpause = () => {
      pausedTime = Date.now() // 记录暂停的时间
      clearInterval(timer)
    }
    
    mediaRecorder.onresume = () => {
      const resumedTime = Date.now()
      startTime += resumedTime - pausedTime // 更新开始时间，以补偿暂停的时间
      timer = setInterval(() => {
        totalDuration.value += 0.01
      }, 10)
    }

    mediaRecorder.start()

    audioCtx = new AudioContext()
    const source = audioCtx.createMediaStreamSource(stream)
    const analyser = audioCtx.createAnalyser()
    source.connect(analyser)

    // const waveArray = new Uint8Array(analyser.frequencyBinCount)
    const dataArray = new Uint8Array(analyser.fftSize)
    const threshold = 0.01 // 0.01 表示将频谱数据的阈值设为 255 的 1%，即 2.55
    const silenceDuration = 2000 // 静音检测长度(ms)
    const checkInterval = 100 // 检查间隔(ms)
    const endSilentFrames = 15000 / checkInterval // 连续15秒没有操作时结束录音
    const requiredSilentFrames = silenceDuration / checkInterval // 需要的连续静音帧数

    silentFrameCount = 0

    isRecording.value = true
    isNewRecorder = true // 每一轮录音都有一个新任务静音等待期，在这个阶段不会因为静音检测而停止

    onStateUpdate.next(isRecording.value)
    const checkSilence = () => {
      if (!isStarted.value) return // 停止后退出检测

      if (isRecording.value) {
        analyser.getByteTimeDomainData(dataArray)
        const rms = calculateRMS(dataArray)
        const isSilent = rms < threshold
        if (isSilent) {
          silentFrameCount++ // 如果当前检测到静音，计数器加1
        } else {
          silentFrameCount = 0 // 如果检测到非静音，重置计数器
          isNewRecorder = false // 首次检测到非静音之后， isNewRecorder 设置为 false
        }
        // 如果连续静音的帧数达到了要求，停止录音
        if (silentFrameCount >= requiredSilentFrames && !isNewRecorder && isAutoCut.value) {
          console.log('Silence detected, create new recorder...')
          mediaRecorder?.stop()
          clearInterval(timer) // 必须清理掉当前计时器
          startRecording() // 新起录音
          return
        }
        // 连续长时间静音的时候直接结束录制状态
        if (silentFrameCount >= endSilentFrames) {
          onRecorderEnd.next('长时间无活动')
          handleStopRecord()
        }
      }

      setTimeout(checkSilence, checkInterval)
    }

    // console.log('waveEl.value', waveEl.value)
    // const cvs = waveEl.value!
    // const ctx = cvs.getContext('2d')!

    // 循环调用纯函数绘制波形
    // const renderFrame = () => {
    //     if(!isStarted.value) return

    //     // 使用 requestAnimationFrame 实现流畅动画
    //     requestAnimationFrame(renderFrame)
        
    //     // 调用纯函数 `drawWaveform`
    //     drawWaveform(ctx, analyser, cvs.width, cvs.height, isWaveformVisible.value && isRecording.value, themeVars.value.textColor1)
    // }
    // 开始绘制
    // renderFrame()

    mediaRecorder.addEventListener('stop', () => {
      const finalBlob = new Blob(audioChunks, { type: 'audio/webm' })
      ondataavailable.next({ blob: finalBlob, duration: currentDuration, isSilence: isNewRecorder })
      // const { width, height } = cvs
      // ctx.clearRect(0, 0, width, height)
    })

    checkSilence() // 开启静音检测

    mediaRecorder.onerror = function (event) {
      console.error('MediaRecorder error:', event)
      handleStopRecord()
    }
  }

  function handleOperate() {
    console.log('操作')
    silentFrameCount = 0
  }

  function handleStartPause() {
    if (!isStarted.value && !isRecording.value) {
      startRecording()
      return
    }
    if (isStarted.value && isRecording.value) {
      handlePauseRecord()
      return
    }
    if (isStarted.value && !isRecording.value) {
      handleResumeRecord()
      return
    }
  }

  function getCurrentDuration() {
    return (Date.now() - startTime) / 1000
  }
  
  function handlePauseRecord() {
    mediaRecorder?.pause()
    isRecording.value = false
    onStateUpdate.next(isRecording.value)
  }

  function handleResumeRecord() {
    mediaRecorder?.resume()
    isRecording.value = true
    onStateUpdate.next(isRecording.value)
  }

  function handleCut() {
    if (!isStarted.value) return
    mediaRecorder?.stop()
    startRecording() // 新起录音
  }

  // 停止录音
  function handleStopRecord() {
    mediaRecorder?.stop()
    isRecording.value = false
    isStarted.value = false
    mediaRecorder = null
    stream?.getTracks().forEach(track => track.stop())
    stream = null
    audioCtx?.close()
    audioCtx = null
    onRecorderEnd.next('录制结束')
    onStateUpdate.next(isRecording.value)
    totalDuration.value = 0
    clearInterval(timer)
  }

  function init() {
    mediaRecorder?.stop()
    mediaRecorder = null
    stream?.getTracks().forEach(track => track.stop())
    stream = null
    audioCtx?.close()
    audioCtx = null
  }

  function handleWaveformVisible() {
    isWaveformVisible.value = !isWaveformVisible.value
  }

  return {
    waveEl,
    totalDuration,
    currentDuration,
    isWaveformVisible,
    isRecording,
    isStarted,
    isAutoCut,
    onStateUpdate,
    ondataavailable,
    onRecorderEnd,
    getCurrentDuration,
    handleOperate,
    handleStartPause,
    handleStopRecord,
    handleCut,
    handleWaveformVisible
  }
}

// 计算当前帧的均方根 (RMS) 值
function calculateRMS(dataArray) {
  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    const normalizedSample = dataArray[i] / 128 - 1.0 // 将样本值从 [0, 255] 归一化到 [-1, 1]
    sum += normalizedSample * normalizedSample // 计算平方和
  }
  return Math.sqrt(sum / dataArray.length) // 均方根 (RMS)
}

const drawWaveform = (
  canvasCtx: CanvasRenderingContext2D, // Canvas 上下文
  analyser: AnalyserNode, // 音频 AnalyserNode
  canvasWidth: number, // Canvas 宽度
  canvasHeight: number, // Canvas 高度
  isEnable: boolean, // 是否启用
  strokeStyle?: string | CanvasGradient | CanvasPattern
): void => {
  if (!isEnable) return
  
  // 获取时间域数据
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyser.getByteTimeDomainData(dataArray)

  // 清空画布
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)

  // 设置线条样式
  canvasCtx.lineWidth = 2
  canvasCtx.strokeStyle = strokeStyle || 'rgb(0, 0, 0)'

  // 开始绘制波形图
  canvasCtx.beginPath()

  const sliceWidth = canvasWidth / bufferLength
  let x = 0

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0
    const y = (v * canvasHeight) / 2

    if (i === 0) {
      canvasCtx.moveTo(x, y)
    } else {
      canvasCtx.lineTo(x, y)
    }

    x += sliceWidth
  }

  canvasCtx.lineTo(canvasWidth, canvasHeight / 2)
  canvasCtx.stroke()
}

//  可能要考虑到 worker 中进行
export async function checkSilenceAudio(blob: Blob) {
  const frameSize: number = 2048
  const energyThreshold: number = 0.01
  const zeroCrossingThreshold: number = 0.1
  const arrayBuffer = await blob.arrayBuffer()
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  const channelData = audioBuffer.getChannelData(0)
  const frameCount = Math.floor(channelData.length / frameSize)

  for (let i = 0; i < frameCount; i++) {
    const start = i * frameSize
    const end = start + frameSize
    const frame = channelData.slice(start, end)

    // 计算短时能量
    const energy = frame.reduce((sum, sample) => sum + sample * sample, 0) / frame.length

    // 计算过零率
    let zeroCrossings = 0
    for (let j = 1; j < frame.length; j++) {
      if ((frame[j - 1] >= 0 && frame[j] < 0) || (frame[j - 1] < 0 && frame[j] >= 0)) {
        zeroCrossings++
      }
    }
    const zeroCrossingRate = zeroCrossings / frame.length

    // 判断是否为静音
    if (energy > energyThreshold || zeroCrossingRate > zeroCrossingThreshold) {
      return false // 有说话或其他声音
    }
  }
  return true
}

// const draw = () => {
//   requestAnimationFrame(draw)
//   const { width, height } = cvs
//   ctx.clearRect(0, 0, width, height)
//   analyser.getByteFrequencyData(waveArray)
//   const len = waveArray.length / 2.5
//   const barWidth = width / len / 2
//   for (let i = 0; i < len; i++) {
//     const wave = waveArray[i]
//     const barHeight = (wave / 255) * height
//     const x1 = i * barWidth + width / 2
//     const x2 = width / 2 - (i + 1) * barWidth
//     const y = height - barHeight
//     ctx.fillRect(x1, y, barWidth - 2, barHeight)
//     ctx.fillRect(x2, y, barWidth - 2, barHeight)
//   }
// }