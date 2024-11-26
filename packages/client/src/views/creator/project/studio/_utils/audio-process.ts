// import useStore from "@/store"
// type Action = Required<Parameters<ReturnType<ReturnType<typeof useStore>['projectStore']['fragment']>['createByAudio']>[0][0]['actions']>[0]
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

export async function deleteAudioSegments(
  audioBuffer: AudioBuffer,
  segmentsToDelete: { startTime: number; endTime: number }[]
): Promise<AudioBuffer> {
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

export async function splitAudio(
  audioSource: string | AudioBuffer, // 接收 string (URL) 或 AudioBuffer
  splitPoints: number[], // 接收切割点数组，单位是秒
  cb?:(previousPoint: number, currentPoint: number, index: number) => void // 每次分割时调用的回调函数
) {
  let audioBuffer: AudioBuffer
  const audioContext = new AudioContext() // 统一复用 AudioContext 实例

  // 判断 audioSource 是 URL 还是 AudioBuffer
  if (typeof audioSource === 'string') {
    try {
      // 如果是 URL，加载并解析音频
      const response = await fetch(audioSource)
      const arrayBuffer = await response.arrayBuffer()
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    } catch (error) {
      throw new Error('Failed to load or decode the audio data from URL.')
    }
  } else if (audioSource instanceof AudioBuffer) {
    // 如果是 AudioBuffer，直接使用
    audioBuffer = audioSource
  } else {
    throw new Error('Invalid audio source. Must be a URL or AudioBuffer.')
  }

  // 获取采样点
  // const sampleRate = audioBuffer.sampleRate

  // 校正切割点，确保不超过音频总长度
  const audioDuration = audioBuffer.duration
  splitPoints = splitPoints.map(point => Math.min(point, audioDuration))

  // 确保切割点有效，排除无效切割点（负数、超出音频长度的等）
  splitPoints = splitPoints.filter(point => point >= 0 && point <= audioDuration)

  // 添加音频结束时间作为最后一个切割点
  if (splitPoints[splitPoints.length - 1] !== audioDuration) {
    splitPoints.push(audioDuration)
  }

  // 初始化结果数组，用于存储每个裁剪后的音频片段
  const audioChunks: AudioBuffer[] = []

  // 前一个切割点（起点），初始化为0
  let previousPoint = 0

  for (let i = 0; i < splitPoints.length; i++) {
    const currentPoint = splitPoints[i]

    // 计算裁剪的起始点和结束点
    const startSample = Math.floor(previousPoint * audioBuffer.sampleRate)
    const endSample = Math.floor(currentPoint * audioBuffer.sampleRate)
    const length = endSample - startSample

    // 创建新的 AudioBuffer 存储这个片段
    const chunkBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, length, audioBuffer.sampleRate)

    // 将原始音频的片段复制到新的 AudioBuffer 中
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = new Float32Array(length)
      audioBuffer.copyFromChannel(channelData, channel, startSample)
      chunkBuffer.copyToChannel(channelData, channel)
    }

    // 重新计算和分配动作关键帧
    // let actionChunk: Action[] = []
    // if (actions && actions.length > 0) {
    //   actionChunk = actions.filter(action => {
    //     if(previousPoint <= action.keyframe && action.keyframe <= currentPoint) return true
    //   }).map(action => {
    //     action.keyframe = action.keyframe - previousPoint
    //     return action
    //   })
    // }
    cb?.(previousPoint, currentPoint, i)

    // 计算当前片段的时长
    // const duration = currentPoint - previousPoint
    // console.log(currentPoint, previousPoint, duration)
    // console.log(duration, length / sampleRate)
    // 将裁剪后的片段加入数组
    audioChunks.push(chunkBuffer)

    // 更新前一个切割点
    previousPoint = currentPoint
  }

  // 返回裁剪后的多个 AudioBuffer 片段
  return audioChunks
}

export function findLowPoints(audioData: Float32Array, sampleRate: number, segmentDuration: number, windowSize: number, threshold: number): number[] {
  const segmentLength = segmentDuration * sampleRate // 每段预定的长度（样本数）
  const windowLength = windowSize * sampleRate // 查找窗口的长度（样本数）
  const lowPoints: number[] = []

  let currentIndex = segmentLength // 初始查找位置，从第一个 60 秒位置开始

  while (currentIndex < audioData.length) {
    let minVolume = Infinity
    let minIndex = currentIndex

    // 在当前 segment 周围的 window 范围内查找音量最低点
    for (let j = currentIndex - windowLength; j <= currentIndex; j++) {
      // 确保索引不越界
      if (j >= 0 && j < audioData.length) {
        const volume = Math.abs(audioData[j]) // 获取音量值
        // 小于或等于，一般都会出现 0 的情况，如果不加入等于的情况，会结果靠近左侧，反之，结果靠近右侧
        if (volume <= minVolume) {
          minVolume = volume
          minIndex = j // 记录音量最低的索引
        }
      }
    }

    // 如果找到的最低点音量小于阈值，则将其认为是低音点
    if (minVolume < threshold) {
      lowPoints.push(minIndex) // 记录分割点
    } else {
      // Fallback 方案：没有找到低音点，则使用预定分割点
      lowPoints.push(currentIndex)
    }

    // 下一次的查找起始点为上一次分割点
    currentIndex = minIndex + segmentLength // 从上一次的分割点开始，加上 segment 长度
  }

  return lowPoints
}
