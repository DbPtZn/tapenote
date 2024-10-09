export class AudioRecorder {
  private audioContext: AudioContext
  private mediaStream: MediaStream | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private audioSegments: Blob[] = []
  private sampleRate: number
  private sampleBits: number
  // private silenceThreshold: number // 静音阈值时长 (秒)
  private onSegmentCallback: ((arg: { segment: Blob; duration: number }) => void) | null = null // 分段回调
  // private longRecording: boolean // 是否启用静音分段功能

  public totalDuration: number = 0
  private startTime: number = 0
  private isRecording = false

  private audioBlob: Blob | null = null

  constructor(args: { sampleRate?: number; sampleBits?: number; }) {
    const { sampleRate, sampleBits } = args
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.sampleRate = sampleRate || 44100
    this.sampleBits = sampleBits || 16
    // this.silenceThreshold = silenceThreshold || 0.01 // 静音阈值
    // this.longRecording = longRecording || false // 是否为长录制(长录制模式下，开启分段功能)
  }

  public onSegment(callback?: (arg: { segment: Blob; duration: number }) => void) {
    this.onSegmentCallback = callback || null // 设置回调函数，默认没有回调
  }

  longRecording(callback: (arg: { blob: Blob; duration: number }) => void, silenceThreshold: number) {
    const sampleRate = this.sampleRate
    const sampleBits = this.sampleBits
    let mediaRecorder: MediaRecorder | null = null
    async function startRecording() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: sampleRate,
          sampleSize: sampleBits,
          channelCount: 1
        },
        video: false
      })

      let totalDuration = 0
      let startTime = Date.now()
      
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      let audioChunks: Blob[] = [] // 重置音频块

      mediaRecorder.ondataavailable = async event => {
        if (event.data.size > 0) {
          // console.log('add chunk', event, '音频数据块的大小（MB）:', event.data.size / (1024 * 1024))
          const endTime = Date.now()
          totalDuration += (endTime - startTime) / 1000
          startTime = Date.now()

          audioChunks.push(event.data)
        }
      }

      mediaRecorder.start()

      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.fftSize)
      const threshold = silenceThreshold // 0.01 表示将频谱数据的阈值设为 255 的 1%，即 2.55
      const silenceDuration = 1500 // 静音检测长度(ms)
      const checkInterval = 100 // 检查间隔(ms)
      const requiredSilentFrames = silenceDuration / checkInterval // 需要的连续静音帧数

      let silentFrameCount = 0
      let isRecording = true

      const checkSilence = () => {
        if (!isRecording) return // 停止后退出检测

        analyser.getByteTimeDomainData(dataArray)
        const rms = calculateRMS(dataArray)
        const isSilent = rms < threshold
        if (isSilent) {
          silentFrameCount++ // 如果当前检测到静音，计数器加1
        } else {
          silentFrameCount = 0 // 如果检测到非静音，重置计数器
        }
        // 如果连续静音的帧数达到了要求，停止录音
        if (silentFrameCount >= requiredSilentFrames) {
          mediaRecorder?.stop()
          startRecording() // 新起录音
          return
        }

        setTimeout(checkSilence, checkInterval)
      }

      mediaRecorder.addEventListener('stop', () => {
        const finalBlob = new Blob(audioChunks, { type: 'audio/webm' })
        callback({ blob: finalBlob, duration: totalDuration })
        isRecording = false
      })

      checkSilence() // 开启静音检测
    }

    startRecording()

    return () => {
      mediaRecorder?.stop()
    }
  }

  public start(isSilenceEnd?: boolean) {
    return navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: this.sampleRate,
          sampleSize: this.sampleBits,
          channelCount: 1
        },
        video: false
      })
      .then(stream => {
        // console.log('media stream', stream)
        this.startTime = Date.now()
        this.isRecording = true

        this.mediaStream = stream
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
        this.audioChunks = [] // 重置音频块
        this.audioSegments = [] // 重置音频分段

        this.mediaRecorder.ondataavailable = async event => {
          if (event.data.size > 0) {
            // console.log('add chunk', event, '音频数据块的大小（MB）:', event.data.size / (1024 * 1024))
            // 计算时长
            const endTime = Date.now()
            const duration = (endTime - this.startTime) / 1000
            this.totalDuration += duration
            this.startTime = Date.now()
            this.audioChunks.push(event.data)
          }
        }

        // TODO 估算时长音频大小，每间隔产生 chunk 之后检测 chunk 大小，如果超过阈值自动分片上传
        this.mediaRecorder.start()
        return { stream, mediaRecorder: this.mediaRecorder }
      })
  }

  public pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      // this.isRecording = false
      this.mediaRecorder.requestData()
      this.mediaRecorder.pause()
    }
  }

  public resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      // this.isRecording = true
      this.mediaRecorder.resume()
    }
  }

  public stop(): Promise<{ blob: Blob; duration: number }> {
    return new Promise((resolve, reject) => {
      if (this.mediaRecorder) {
        // this.isRecording = false
        // console.log('stop recorder', this.isRecording)
        this.mediaRecorder.onstop = async () => {
          try {
            const finalBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
            const trimmedBlob = await this.trimSilence(finalBlob)
            this.audioBlob = trimmedBlob
            resolve({ blob: this.audioBlob, duration: this.totalDuration })
          } catch (error) {
            reject(new Error('音频数据样本太小，生成音频失败'))
          }
        }

        this.mediaRecorder.stop()
        this.mediaStream?.getTracks().forEach(track => track.stop())
      } else {
        reject(new Error('Recorder is not initialized.'))
      }
    })
  }

  destroy() {
    this.mediaRecorder?.stop()
    this.mediaStream?.getTracks().forEach(track => track.stop())
    this.mediaStream = null
    this.audioContext?.close()
    this.mediaRecorder = null
  }

  private async trimSilence(audioBlob: Blob): Promise<Blob> {
    const arrayBuffer = await audioBlob.arrayBuffer()
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

    const trimmedBuffer = this.removeSilence(audioBuffer)
    const wavData = AudioRecorder.audioBufferToWav(trimmedBuffer)
    return new Blob([wavData], { type: 'audio/wav' })
  }

  public async getWAVBlob(): Promise<Blob | null> {
    if (!this.audioBlob) return null

    const arrayBuffer = await this.audioBlob.arrayBuffer()
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

    const wavData = AudioRecorder.audioBufferToWav(audioBuffer)
    return new Blob([wavData], { type: 'audio/wav' })
  }

  static async toWAVBlob(blob: Blob): Promise<Blob> {
    const audioCtx = new AudioContext()
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

      const wavData = this.audioBufferToWav(audioBuffer)
      return new Blob([wavData], { type: 'audio/wav' })
    } catch (error) {
      throw error // 重新抛出错误，以便调用者可以处理
    } finally {
      if (audioCtx.state !== 'closed') {
        await audioCtx.close()
      }
    }
  }

  static audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const numChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const format = 1 // PCM
    const bitsPerSample = 16

    const bytesPerSample = bitsPerSample / 8
    const blockAlign = numChannels * bytesPerSample
    const byteRate = sampleRate * blockAlign
    const dataLength = buffer.length * bytesPerSample

    const bufferLength = 44 + dataLength
    const arrayBuffer = new ArrayBuffer(bufferLength)
    const dataView = new DataView(arrayBuffer)

    let offset = 0
    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        dataView.setUint8(offset++, str.charCodeAt(i))
      }
    }

    // RIFF identifier
    writeString('RIFF')
    dataView.setUint32(offset, bufferLength - 8, true)
    offset += 4
    // RIFF type
    writeString('WAVE')
    // format chunk identifier
    writeString('fmt ')
    dataView.setUint32(offset, 16, true)
    offset += 4
    dataView.setUint16(offset, format, true)
    offset += 2
    dataView.setUint16(offset, numChannels, true)
    offset += 2
    dataView.setUint32(offset, sampleRate, true)
    offset += 4
    dataView.setUint32(offset, byteRate, true)
    offset += 4
    dataView.setUint16(offset, blockAlign, true)
    offset += 2
    dataView.setUint16(offset, bitsPerSample, true)
    offset += 2
    // data chunk identifier
    writeString('data')
    dataView.setUint32(offset, dataLength, true)
    offset += 4

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      for (let i = 0; i < channelData.length; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]))
        dataView.setInt16(44 + channel * bytesPerSample + i * bytesPerSample, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      }
    }

    return arrayBuffer
  }

  private removeSilence(buffer: AudioBuffer): AudioBuffer {
    const threshold = 0.01 // 静音阈值
    let start = 0
    let end = buffer.length

    // 找到开始位置
    for (let i = 0; i < buffer.length; i++) {
      const sample = this.getSampleValue(buffer, i)
      if (Math.abs(sample) > threshold) {
        start = i
        break
      }
    }

    // 找到结束位置
    for (let i = buffer.length - 1; i >= 0; i--) {
      const sample = this.getSampleValue(buffer, i)
      if (Math.abs(sample) > threshold) {
        end = i + 1
        break
      }
    }

    // 裁剪音频
    const newLength = end - start
    const trimmedBuffer = this.audioContext.createBuffer(buffer.numberOfChannels, newLength, buffer.sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      trimmedBuffer.copyToChannel(buffer.getChannelData(channel).subarray(start, end), channel)
    }

    return trimmedBuffer
  }

  private getSampleValue(buffer: AudioBuffer, index: number): number {
    let value = 0
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      value += buffer.getChannelData(channel)[index]
    }
    return value / buffer.numberOfChannels // 返回平均值
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

// private removeSilence(buffer: AudioBuffer, silenceDuration: number): AudioBuffer {
//   const threshold = 0.02 // 静音阈值
//   const sampleRate = buffer.sampleRate
//   const silenceSamples = silenceDuration * sampleRate

//   let start = 0
//   let end = buffer.length

//   // 找到开始位置
//   for (let i = 0; i < buffer.length; i++) {
//     const sample = this.getSampleValue(buffer, i)
//     if (Math.abs(sample) > threshold) {
//       start = Math.max(0, i - silenceSamples) // 保留静音时长
//       break
//     }
//   }

//   // 找到结束位置
//   for (let i = buffer.length - 1; i >= 0; i--) {
//     const sample = this.getSampleValue(buffer, i)
//     if (Math.abs(sample) > threshold) {
//       end = Math.min(buffer.length, i + silenceSamples + 1) // 保留静音时长
//       break
//     }
//   }

//   // 裁剪音频
//   const newLength = end - start
//   const trimmedBuffer = this.audioContext.createBuffer(buffer.numberOfChannels, newLength, buffer.sampleRate)

//   for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
//     trimmedBuffer.copyToChannel(buffer.getChannelData(channel).subarray(start, end), channel)
//   }

//   return trimmedBuffer
// }
