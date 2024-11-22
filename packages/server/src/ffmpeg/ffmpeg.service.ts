import { Injectable } from '@nestjs/common'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { exec } from 'child_process'
import { StorageService } from 'src/storage/storage.service'
import FfmpegModule from '@ffmpeg-installer/ffmpeg'

@Injectable()
export class FfmpegService {
  constructor(private readonly storageService: StorageService) {
    // console.log(FfmpegModule.path)
    ffmpeg.setFfmpegPath(FfmpegModule.path)
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

  /** 将音频文件转换成 ogg 格式 (转 mp3 格式会出现输出音频时长不一致的问题) */
  async convertToOgg(source: string, target: string) {
    return new Promise<string>((resolve, reject) => {
      ffmpeg(source)
        .toFormat('ogg')
        .save(target)
        .on('error', function (err) {
          console.log('An error occurred: ' + err.message)
          reject(err)
        })
        .on('end', function () {
          // console.log('Processing finished successfully')
          resolve(target)
        })
    })
  }

  /** 将音频文件转换成 ogg 格式 (转 mp3 格式会出现输出音频时长不一致的问题) */
  async convertToMp3(source: string, target: string) {
    return new Promise<string>((resolve, reject) => {
      ffmpeg(source)
        .toFormat('mp3')
        .save(target)
        .on('error', function (err) {
          console.log('An error occurred: ' + err.message)
          reject(err)
        })
        .on('end', function () {
          // console.log('Processing finished successfully')
          resolve(target)
        })
    })
  }

  createBlankAudio(duration: number, outputPath: string) {
    console.log('创建空白音频')
    return new Promise<string>((resolve, reject) => {
      try {
        ffmpeg()
          // 设置输入源为 anullsrc
          .input('anullsrc=r=44100:cl=mono')
          .inputFormat('lavfi')
          .audioChannels(1) // 设置单声道
          .audioFrequency(44100) // 设置采样率
          .duration(duration)
          // 设置输出格式为 WAV
          .outputFormat('wav')
          // 设置持续时间
          // 设置输出文件路径
          .output(outputPath)
          // 执行转换
          .on('start', function (commandLine) {
            // console.log('Spawned Ffmpeg with command: ' + commandLine)
          })
          .on('progress', function (progress) {
            // console.log('Processing: ' + progress.percent + '% done')
          })
          .on('end', function () {
            // console.log('Finished processing')
            resolve(outputPath)
          })
          .on('error', function (err) {
            console.error('生成空白音频失败: ' + err.message)
            reject(err)
          })
          .run() // 执行命令
      } catch (error) {
        console.error('生成空白音频失败: ' + error.message)
        throw error
      }
    })
  }

  // audioformat2(inputPath: string, outputPath: string) {
  //   return new Promise<string>((resolve, reject) => {
  //     try {
  //       ffmpeg()
  //         .input(inputPath)
  //         .outputOptions('-ac 1')
  //         .outputOptions('-ab 16k')
  //         .outputOptions('-ar 16000')
  //         .save(outputPath)
  //         .on('end', function () {
  //           // console.log(outputPath)
  //           // fs.unlinkSync(inputPath)
  //           resolve(outputPath)
  //         })
  //         .on('error', function (err) {
  //           console.log(err)
  //           reject(err)
  //         })
  //     } catch (error) {
  //       console.log('格式化音频文件失败：')
  //       console.log(error)
  //       reject(error)
  //     }
  //   })
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
        console.log('格式化音频文件失败：')
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
   * 拼接音频文件
   * @param audioPathGroup 音频文件路径数组
   * @param outputPath 拼接结果保存地址
   */
   concatAudioToOgg(audioPathGroup: string[], outputPath: string) {
    return new Promise<string>((resolve, reject) => {
      // const wav = this.storageService.createTempFilePath('.wav')
      const command = ffmpeg()

      // for(const path of audioPathGroup) {
      //   console.log(path)
      //   const localPath = this.storageService.createTempFilePath('.wav')
      //   fs.writeFileSync(localPath, fs.readFileSync(path))
      //   command.input(localPath)
      // }
      audioPathGroup.forEach(path => {
        command.input(path)
      })

      command
        .concat(outputPath)
        .on('end', () => {
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
      // 目前通过把 start_duration 设置得尽量小解决问题，待后续观察
      ffmpeg()
        .input(inputPath)
        .audioFilter('silenceremove=start_periods=1:start_duration=0.1:start_threshold=-50dB:detection=peak')
        .output(outputPath)
        .on('error', (err, stdout, stderr) => {
          console.error('清理静音部分出错:', err.message)
          reject(err)
        })
        .on('end', () => {
          // console.log('静音部分清理完成')
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
