export async function cropAudio(
  audioSource: string | AudioBuffer, // 接收 string (URL) 或 AudioBuffer
  startTime: number,
  endTime: number
): Promise<AudioBuffer> {
  let audioBuffer: AudioBuffer

  // 判断 audioSource 是 URL 还是 AudioBuffer
  if (typeof audioSource === 'string') {
    // 如果是 URL，创建 AudioContext 并加载音频
    const audioContext = new AudioContext()
    const response = await fetch(audioSource)
    const arrayBuffer = await response.arrayBuffer()
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  } else if (audioSource instanceof AudioBuffer) {
    // 如果是 AudioBuffer，直接使用
    audioBuffer = audioSource
  } else {
    throw new Error('Invalid audio source. Must be a URL or AudioBuffer.')
  }

  // 校正结束时间，确保不超过音频长度
  endTime = Math.min(endTime, audioBuffer.duration)

  // 确保裁剪时间有效
  if (startTime >= endTime || startTime < 0 || endTime > audioBuffer.duration) {
    throw new Error('Invalid start or end time for cropping audio.')
  }

  // 获取采样率（每秒采样数）
  const sampleRate: number = audioBuffer.sampleRate

  // 计算采样点：将秒数转换为对应的采样帧数
  const startSample: number = Math.floor(startTime * sampleRate)
  const endSample: number = Math.floor(endTime * sampleRate)
  const length: number = endSample - startSample

  // 创建一个新的 AudioBuffer 存储裁剪后的音频
  const croppedBuffer: AudioBuffer = new AudioContext().createBuffer(audioBuffer.numberOfChannels, length, sampleRate)

  // 将原始音频的片段复制到新的 AudioBuffer 中
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const sourceData: Float32Array = audioBuffer.getChannelData(channel)
    const croppedData: Float32Array = croppedBuffer.getChannelData(channel)

    // 使用 subarray() 方法复制所需的音频片段
    croppedData.set(sourceData.subarray(startSample, endSample))
  }

  // 返回裁剪后的 AudioBuffer
  return croppedBuffer
}

// 播放裁剪后的音频片段
export function playCroppedAudio(croppedBuffer: AudioBuffer): void {
  const audioContext: AudioContext = new AudioContext()
  const source: AudioBufferSourceNode = audioContext.createBufferSource()

  source.buffer = croppedBuffer
  source.connect(audioContext.destination)
  source.start()
}

export async function deleteAudioSegments(audioBuffer: AudioBuffer, segmentsToDelete: { startTime: number; endTime: number }[]): Promise<AudioBuffer> {
  const sampleRate = audioBuffer.sampleRate

  // 排序并合并重叠的时间段，确保删除片段顺序正确且没有重叠
  segmentsToDelete.sort((a, b) => a.startTime - b.startTime)

  const mergedSegments = segmentsToDelete.reduce(
    (acc, current) => {
      const lastSegment = acc[acc.length - 1]
      if (!lastSegment || lastSegment.endTime < current.startTime) {
        acc.push(current) // 没有重叠，直接添加
      } else {
        // 合并重叠的时间段
        lastSegment.endTime = Math.max(lastSegment.endTime, current.endTime)
      }
      return acc
    },
    [] as { startTime: number; endTime: number }[]
  )

  let newBufferLength = audioBuffer.length
  mergedSegments.forEach(segment => {
    const deleteStartSample = Math.floor(segment.startTime * sampleRate)
    const deleteEndSample = Math.floor(segment.endTime * sampleRate)
    newBufferLength -= deleteEndSample - deleteStartSample
  })

  // 创建新的 AudioBuffer 来保存最终的音频数据
  const audioContext = new AudioContext()
  const newAudioBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, newBufferLength, sampleRate)

  // 逐个通道处理
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const oldChannelData = audioBuffer.getChannelData(channel)
    const newChannelData = newAudioBuffer.getChannelData(channel)

    let oldOffset = 0 // 原音频数据的偏移量
    let newOffset = 0 // 新音频数据的偏移量

    mergedSegments.forEach(segment => {
      const deleteStartSample = Math.floor(segment.startTime * sampleRate)
      const deleteEndSample = Math.floor(segment.endTime * sampleRate)

      // 复制删除段之前的部分到新缓冲区
      if (deleteStartSample > oldOffset) {
        newChannelData.set(oldChannelData.subarray(oldOffset, deleteStartSample), newOffset)
        newOffset += deleteStartSample - oldOffset
      }

      // 更新 oldOffset，跳过删除的部分
      oldOffset = deleteEndSample
    })

    // 复制删除段之后的剩余部分
    if (oldOffset < audioBuffer.length) {
      newChannelData.set(oldChannelData.subarray(oldOffset), newOffset)
    }
  }

  return newAudioBuffer
}

export function formatTimeToMinutesSecondsMilliseconds(sec: number) {
  const minutes = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0')
  const milliseconds = Math.floor((sec - Math.floor(sec)) * 100)
    .toString()
    .padStart(2, '0')

  return `${minutes}:${seconds}:${milliseconds}`
}
