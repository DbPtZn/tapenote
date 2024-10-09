// TODO 由于 js-audio-recorder 插件的有点过时了，后续考虑替换成新的 api 实现音频录制功能
import { AudioRecorder } from '../_utils/recorder'
export function useRecorder() {
  const recorder = new AudioRecorder({
    sampleRate: 16000,
    sampleBits: 16,
  })
  
  let stopRecording
  // 获取用户媒体权限，启动录音
  function handleStartRecord() {
    stopRecording = recorder.longRecording(
      (data) => {
        console.log('录音分段', data.duration)
      },
      0.01
    )
  }

  // 停止录音
  function handleStopRecord() {
    stopRecording?.()
  }

  return {
    handleStartRecord,
    handleStopRecord
  }
}
