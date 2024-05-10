import { Injectable } from '@nestjs/common'
import ffmpeg from 'fluent-ffmpeg'
import { tmpdir } from 'os'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { StorageService } from 'src/storage/storage.service'

@Injectable()
export class FfmpegService {
  constructor(private readonly storageService: StorageService) {
    // this.test()
  }
  // async test() {
  //   const audio = 'C:/Users/admin/Desktop/new-project/server/public/uWgrfCru/audio/65fd8c154b2496c352ce9521.wav'
  //   const d1 = await this.calculateDuration(audio)
  //   const temppath = `C:/Users/admin/Desktop/new-project/server/public/uWgrfCru/temp/${Date.now().toString()}.wav`
  //   console.log(temppath)
  //   await this.clearSilence(audio, temppath)
  //   const d2 = await this.calculateDuration(audio)
  //   console.log([d1, d2])
  // }
  /**
   * 音频格式化处理
   * @param inputPath 源文件路径（可以是指向资源文件的路径也可以是文件数据），此方法会自动删除源文件 inputPath指向的资源文件
   * @param outputPath 存储目标资源文件的路径 (会在目标路径创建一个资源文件)
   */
  audioformat(inputPath: string, outputPath: string) {
    return new Promise<string>((resolve, reject) => {
      try {
        ffmpeg()
          .input(inputPath)
          .outputOptions('-ac 1')
          .outputOptions('-ab 16k')
          .outputOptions('-ar 16000')
          .outputOptions('-acodec pcm_s16le')
          .save(outputPath)
          .on('end', function () {
            // console.log(outputPath)
            fs.unlinkSync(inputPath)
            resolve(outputPath)
          })
          .on('error', function (err) {
            console.log(err)
            reject(err)
          })
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  /**
   * 拼接音频文件
   * @param audioPathGroup 音频文件路径数组
   * @param outputPath 拼接结果保存地址
   */
  concatAudio(audioPathGroup: string[], outputPath: string) {
    return new Promise<string>((resolve, reject) => {
      const command = ffmpeg()

      audioPathGroup.forEach(path => {
        command.input(path)
      })

      command
        .concat(outputPath)
        .on('end', function () {
          // console.log('finished processing')
          resolve(outputPath)
        })
        .on('error', error => {
          console.log(error)
          reject(error)
        })
    })
  }

  /**
   * 清理音频首尾静音部分
   * @param inputPath
   * @param outputPath
   */
  clearSilence(inputPath: string, outputPath: string) {
    return new Promise((resolve, reject) => {
      // :stop_periods=1:stop_threshold=-50dB:stop_silence=1
      // TODO 实现依然存在问题，在不同机器的测试中发现有些时候会将音频中有效音部分也去除
      ffmpeg()
        .input(inputPath)
        .inputOption(
          '-filter_complex silenceremove=start_periods=1:start_duration=0.5:start_threshold=-50dB:detection=peak'
        )
        .output(outputPath)
        .on('error', (err, stdout, stderr) => {
          console.error('清理静音部分出错:', err.message)
          reject(err)
        })
        .on('end', () => {
          console.log('静音部分清理完成')
          fs.unlinkSync(inputPath)
          resolve(outputPath)
        })
        .run()
    })
  }

  /** 计算音频时长 */
  calculateDuration(filepath: string) {
    return new Promise<number>((resolve, reject) => {
      // 1.ffprobe: 这是一个来自 FFmpeg 软件包的工具，用于分析和检查多媒体文件的属性。
      // 2.-v error: 这是 ffprobe 的选项，它指定了输出的日志级别。在这里，error 级别意味着只输出错误信息。
      // 3.-show_entries format=duration: 这个选项告诉 ffprobe 显示关于视频格式的信息，并且只包含持续时间（duration）的信息。
      // 4.-of default=noprint_wrappers=1:nokey=1: 这是输出格式选项，它定义了输出的格式。在这里，它指定了输出的格式为默认格式，但是禁用了包装器，同时禁用了键
      const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filepath}"`
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`执行 FFmpeg 命令时出错：${error.message}`)
          reject(error)
          return
        }
        if (stderr) {
          console.error(`FFmpeg 命令输出了错误信息：${stderr}`)
          reject(stderr)
          return
        }
        let durationInSeconds = parseFloat(stdout.trim())
        // 非数字或 NaNs 的情况
        if (typeof durationInSeconds !== 'number' || isNaN(durationInSeconds)) {
          durationInSeconds = 0
        }
        // console.log('音频时长:', durationInSeconds, '秒')
        resolve(durationInSeconds)
      })
    })
  }
}
