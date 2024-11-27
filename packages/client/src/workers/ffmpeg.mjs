import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({
  log: true // 如果需要调试信息可以设置为 true
})

self.onmessage = async event => {
  const { command, files, options } = event.data

  try {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load()
    }

    if (command === 'run') {
      // 将文件写入 FFmpeg 的虚拟文件系统
      for (const file of files) {
        ffmpeg.FS('writeFile', file.name, await fetchFile(file.data))
      }

      // 执行 FFmpeg 命令
      await ffmpeg.run(...options)

      // 读取输出文件
      const output = ffmpeg.FS('readFile', options.output)
      self.postMessage({ success: true, output })
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message })
  }
}
