import { Injectable } from '@nestjs/common'
import { CreateTTSFragmentDto } from './dto/create-tts-fragment.dto'
import { Fragment } from './entities/fragment.entity'
import { StorageService } from 'src/storage/storage.service'
import { CreateASRFragmentDto } from './dto/create-asr-fragment.dto'
import { RemovedEnum } from 'src/enum'
import {
  AddPromoterDto,
  DeleteFragmentDto,
  RemoveFragmentDto,
  RemovePromoterDto,
  RestoreFragmentDto,
  UpdateFragmentsTagsDto,
  UpdateSequenceDto,
  UpdateTranscriptDto
} from './dto'
import { SherpaService } from 'src/sherpa/sherpa.service'
import { exec } from 'child_process'
import { CreateBlankFragmentDto } from './dto/create-blank-fragment.dto'
import { ProjectService } from 'src/project/project.service'
import { FfmpegService } from 'src/ffmpeg/ffmpeg.service'
import { CopyFragmentDto } from './dto/copy-fragment'
import * as UUID from 'uuid'

@Injectable()
export class FragmentService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly storageService: StorageService,
    private readonly ffmpegService: FfmpegService,
    private readonly sherpaService: SherpaService
  ) {
    // 测试语音转文字片段功能
    // this.createByAudio(
    //   {
    //     procedureId: new string('65f9bf826c5a54c1b4b2499d'),
    //     audio: `C:\\Users\\26184\\Desktop\\project\\server\\public\\2iFRNkuh\\audio\\660854d1affc7c8d07fb499b.wav`,
    //     duration: 2
    //   },
    //   new string('65ad4e2ebf53393263cf36e9'),
    //   '2iFRNkuh'
    // )
  }

  async createByText(createTTSFragmentDto: CreateTTSFragmentDto, userId: string, dirname: string) {
    const { procedureId, txt, role, speed } = createTTSFragmentDto
    if (speed > 2 || speed <= 0) throw new Error('语速不能大于2或小于等于0')
    if (!txt || !procedureId || !dirname) throw new Error('缺少必要参数！')
    const procudure = await this.projectService.findOneById(procedureId, userId)
    if (!procudure) throw new Error('找不到项目工程文件！')
    const text = txt.replace(/\s*/g, '')
    const fragmentId = UUID.v4()
    /** 创建音频存储地址 */
    const { filepath, filename } = this.storageService.createFilePath({
      dirname: [dirname, procudure.dirname],
      category: 'audio',
      originalname: fragmentId,
      extname: '.wav'
    })
    const fragment = new Fragment()
    fragment.id = UUID.v4()
    fragment.project = procudure
    fragment.audio = filename
    fragment.duration = 0
    fragment.txt = text
    fragment.transcript = ['该片段语音识别/合成中因异常跳出而产生的，看见时请将此片段删除'] // Array.from(text)
    fragment.tags = new Array(text.length)
    fragment.promoters = new Array(text.length)
    fragment.timestamps = []
    fragment.role = Number(role) || 0
    fragment.removed = RemovedEnum.NEVER

    /** 先添加到项目工程文件中（占位） */
    await this.projectService.addFragment(procedureId, userId, fragment)

    const temppath1 = this.storageService.createTempFilePath('.wav')
    // console.log(fragment.audio)
    /** 文字转音频 */
    await this.useTTS({
      txt: text,
      filepath: temppath1,
      speed: speed | 1
    })
      .then(async () => {
        fragment.transcript = Array.from(text) // 合成成功，将正确内容替换回去

        const temppath2 = this.storageService.createTempFilePath('.wav')
        /** 清理静音 */
        // FIXME: 静音清理存在问题，可能会把过短的音频处理掉，比如 “呱” 合成的语音还有 “哈撒给”的“哈”会被裁剪掉
        await this.ffmpegService.clearSilence(temppath1, temppath2)

        /** 格式化音频文件 */
        await this.ffmpegService.audioformat(temppath2, filepath)
        // console.log(filepath)

        /** 计算合成音频的时长 */
        fragment.duration = await this.ffmpegService.calculateDuration(filepath)
        // console.log(fragment.duration)
        /** 计算 timestamps */
        const section = fragment.duration / fragment.transcript.length
        const timestamps = fragment.transcript.map((char, index) => {
          return Number((section * index).toFixed(3))
        })
        // console.log(timestamps)
        fragment.timestamps = timestamps
        if (filepath && fragment.duration !== 0) {
          // console.log(fragment)
          await this.projectService.updateFragment(procedureId, fragment, userId)
        }
      })
      .catch(async err => {
        console.log(err)
        await this.projectService.removeErrorFragment(procedureId, fragmentId, userId)
      })

    // console.log(fragment)
    fragment.audio = filepath // 替换成完整地址返回给前端
    return fragment
  }

  async createByAudio(
    createASRFragmentDto: { procedureId: string; audio: string; duration: number; role: number },
    userId: string,
    dirname: string
  ) {
    const { procedureId, audio, duration, role } = createASRFragmentDto
    if (!audio || !procedureId || !dirname) {
      console.log('输入错误, 缺少必要参数!')
      throw new Error('输入错误, 缺少必要参数！')
    }
    if (duration === 0 || Number(duration) === 0) {
      throw new Error('音频时长为 0 秒，录入音频数据失败，请检查录音设备是否存在问题')
    }
    const procudure = await this.projectService.findOneById(procedureId, userId)
    if (!procudure) {
      throw { msg: '找不到项目工程文件！' }
    }
    const fragment = new Fragment()
    fragment.id = UUID.v4()
    fragment.audio = ''
    fragment.duration = Number(duration)
    fragment.txt = ''
    fragment.transcript = ['该片段语音识别/合成中因异常跳出而产生的，看见时请将此片段删除'] // Array.from(text)
    fragment.tags = []
    fragment.promoters = []
    fragment.timestamps = []
    fragment.role = Number(role) || 9999
    fragment.removed = RemovedEnum.NEVER

    /** 先添加到项目工程文件中（占位） */
    await this.projectService.addFragment(procedureId, userId, fragment)

    const temppath = this.storageService.createTempFilePath('.wav')
    // const d1 = await this.ffmpegService.calculateDuration(audio)
    /** 清理静音 */
    await this.ffmpegService.clearSilence(audio, temppath)
    // const d2 = await this.ffmpegService.calculateDuration(temppath)
    // console.log([d1, d2])
    /** 创建音频地址 */
    const { filename, filepath } = this.storageService.createFilePath({
      dirname: [dirname, procudure.dirname],
      category: 'audio',
      originalname: fragment.id,
      extname: '.wav'
    })
    fragment.audio = filename

    /** 格式化音频文件 */
    await this.ffmpegService.audioformat(temppath, filepath)

    /** 重新计算处理后音频的时长 */
    fragment.duration = await this.ffmpegService.calculateDuration(filepath)

    await this.sherpaService
      .asr(filepath)
      .then(async result => {
        if (result) {
          fragment.txt = result.text
          fragment.timestamps = result.timestamps
          const length = result.tokens?.length
          const tokens = result.tokens.map(token => {
            if (token.includes('@')) {
              const txt = token
                .split('')
                .filter(char => char !== '@')
                .join('')
              return txt
            }
            return token
          })
          fragment.transcript = tokens
          fragment.tags = new Array(length)
          fragment.promoters = new Array(length)
        }
        if (filepath && fragment.transcript.length !== 0 && fragment.duration !== 0) {
          await this.projectService.updateFragment(procedureId, fragment, userId)
        } else {
          this.storageService.deleteSync(filepath)
          throw new Error('语音识别失败！')
        }
      })
      .catch(async err => {
        console.log(err)
        this.storageService.deleteSync(filepath)
        await this.projectService.removeErrorFragment(procedureId, fragment.id, userId)
      })

    fragment.audio = filepath
    return fragment
  }

  async createBlank(dto: CreateBlankFragmentDto, userId: string, dirname: string) {
    const { procedureId, txtLength, duration } = dto
    const procudure = await this.projectService.findOneById(procedureId, userId)
    if (!procudure) {
      throw { msg: '找不到项目工程文件！' }
    }
    const text: string[] = []
    for (let i = 0; i < txtLength; i++) {
      text.push('#')
    }
    /** 计算 timestamps */
    const section = duration / txtLength
    const timestamps = text.map((char, index) => {
      return Number((section * index).toFixed(3))
    })
    const fragment = new Fragment()
    fragment.id = UUID.v4()
    fragment.audio = ''
    fragment.duration = Number(duration)
    fragment.txt = text.join('')
    fragment.transcript = Array.from(text)
    fragment.tags = new Array(text.length)
    fragment.promoters = new Array(text.length)
    fragment.timestamps = timestamps
    fragment.role = 0
    fragment.removed = RemovedEnum.NEVER

    return new Promise<Fragment>((resolve, reject) => {
      // 指定生成文件的位置
      const { filename, filepath } = this.storageService.createFilePath({
        dirname: [dirname, procudure.dirname],
        category: 'audio',
        originalname: fragment.id,
        extname: '.wav'
      })
      // 定义FFmpeg命令
      const ffmpegCommand = `ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t ${duration} ${filepath}`

      // 执行FFmpeg命令
      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('执行FFmpeg命令出错:', error)
          return
        }
        console.log('空白音频生成成功！')
        // 执行成功后的操作，例如：重命名文件、移动文件等
        fragment.audio = filename
        if (filepath && fragment.transcript.length !== 0 && fragment.duration !== 0) {
          this.projectService
            .addFragment(procedureId, userId, fragment)
            .then(() => {
              fragment.audio = filepath
              resolve(fragment)
            })
            .catch(err => {
              this.storageService.deleteSync(filepath)
              reject(err)
            })
        } else {
          this.storageService.deleteSync(filepath)
          reject('空白音频生成失败！')
        }
      })
    })
  }

  useTTS(args: { txt: string; filepath: string; speakerId?: number; speed?: number }) {
    const { txt, filepath, speakerId, speed } = args
    if (txt.length === 0) throw '文本为空！'
    return this.sherpaService.tts(txt, filepath, speakerId, speed)
  }

  async updateTranscript(updateTranscriptDto: UpdateTranscriptDto, userId: string) {
    const { procedureId, fragmentId, newTranscript } = updateTranscriptDto
    const result = await this.projectService.updateFragmentTranscript(procedureId, fragmentId, newTranscript, userId)
    return result
  }

  async updateFragmentsTags(updateFragmentsTagsDto: UpdateFragmentsTagsDto, userId: string) {
    try {
      const { procedureId, newData } = updateFragmentsTagsDto
      const result = await this.projectService.updateFragmentsTags(procedureId, newData, userId)
      return result
    } catch (error) {
      throw error
    }
  }

  async remove(removeFragmentDto: RemoveFragmentDto, userId: string) {
    const { procedureId, fragmentId } = removeFragmentDto
    const result = await this.projectService.removeFragment(procedureId, fragmentId, userId)
    return result
  }

  async restore(restoreFragmentDto: RestoreFragmentDto, userId: string) {
    const { procedureId, fragmentId } = restoreFragmentDto
    const result = await this.projectService.restoreFragment(procedureId, fragmentId, userId)
    return result
  }

  async delete(deleteFragmentDto: DeleteFragmentDto, userId: string, dirname: string) {
    const { procedureId, fragmentId } = deleteFragmentDto
    console.log(deleteFragmentDto)
    const result = await this.projectService.deleteFragment(procedureId, fragmentId, userId, dirname)
    return result
  }

  async addPromoter(addPromoterDto: AddPromoterDto, userId: string) {
    const { procedureId, fragmentId, promoterIndex, promoterSerial, promoterId } = addPromoterDto
    const result = await this.projectService.addFragmentPromoter(
      procedureId,
      fragmentId,
      userId,
      promoterIndex,
      promoterSerial,
      promoterId
    )
    return result
  }

  async removePromoter(removePromoterDto: RemovePromoterDto, userId: string) {
    const { procedureId, fragmentId, promoterIndex } = removePromoterDto
    const result = await this.projectService.removeFragmentPromoter(procedureId, fragmentId, userId, promoterIndex)
    return result
  }

  async updateSequence(updateSequenceDto: UpdateSequenceDto, userId: string) {
    const { procedureId, fragmentId, oldIndex, newIndex } = updateSequenceDto
    const result = await this.projectService.updateSequence(procedureId, fragmentId, userId, oldIndex, newIndex)
    return result
  }

  async copy(dto: CopyFragmentDto, userId: string, dirname: string) {
    return this.projectService.copyFragment({
      ...dto,
      userId,
      dirname
    })
  }
}
