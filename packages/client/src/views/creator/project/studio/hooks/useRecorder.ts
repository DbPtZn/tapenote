// TODO 由于 js-audio-recorder 插件的有点过时了，后续考虑替换成新的 api 实现音频录制功能
export function useRecorder() {
  let mediaRecorder: MediaRecorder | null = null
  let recordedChunks: Blob[] = []
  // 获取用户媒体权限，启动录音
  function start() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.ondataavailable = function (e) {
          recordedChunks.push(e.data)
        }
        mediaRecorder.onstop = function () {
          // 将录制的音频转换为 Blob 格式
          const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' })

          // 创建一个新的音频元素，并设置其 src 为录制的音频 Blob URL
          const audioElement = new Audio()
          audioElement.src = URL.createObjectURL(audioBlob)
          audioElement.controls = true
          document.body.appendChild(audioElement)

          recordedChunks = []
        }
        mediaRecorder.start()
      })
      .catch(function (err) {
        console.log('无法访问用户媒体设备：', err)
      })
  }

  // 停止录音
  function stopRecording() {
    mediaRecorder?.stop()
  }
}
