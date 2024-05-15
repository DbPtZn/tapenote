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
import { LoggerService } from 'src/logger/logger.service'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class FragmentService {
  constructor(
    @InjectRepository(Fragment)
    private fragmentsRepository: Repository<Fragment>,
    private readonly projectService: ProjectService,
    private readonly storageService: StorageService,
    private readonly ffmpegService: FfmpegService,
    private readonly sherpaService: SherpaService,
    private readonly userlogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {}

  /** 通过文本创建音频片段 */
  async createByText(createTTSFragmentDto: CreateTTSFragmentDto, userId: string, dirname: string) {
    const { procedureId, txt, role, speed } = createTTSFragmentDto
    try {
      this.userlogger.log(`正在为项目${procedureId}创建文本转音频片段...`)
      if (speed > 2 || speed <= 0) throw new Error('语速不能大于2或小于等于0')
      if (!txt || !procedureId || !dirname) throw new Error('缺少必要参数！')
      const procudure = await this.projectService.findOneById(procedureId, userId)
      if (!procudure) throw new Error('找不到项目工程文件！')
      const text = txt.replace(/\s*/g, '')
      const fragmentId = UUID.v4()

      // 创建音频存储地址
      const { filepath, filename } = this.storageService.createFilePath({
        dirname: [dirname, procudure.dirname],
        category: 'audio',
        originalname: fragmentId,
        extname: '.wav'
      })
      const fragment = new Fragment()
      fragment.id = fragmentId
      fragment.userId = userId
      fragment.project = procudure
      fragment.audio = filename
      fragment.duration = 0
      fragment.txt = text
      fragment.transcript = ['该片段语音识别/合成中因异常跳出而产生的，看见时请将此片段删除'] // Array.from(text)
      fragment.tags = new Array(text.length).fill(null)
      fragment.promoters = new Array(text.length).fill(null)
      fragment.timestamps = []
      fragment.role = Number(role) || 0
      fragment.removed = RemovedEnum.NEVER

      // 先添加到项目工程文件序列中（占位）
      this.userlogger.log(`向 ${procedureId} 项目 'sequence' 中添加 ${fragmentId} 片段...`)
      await this.projectService.addFragment(procedureId, fragment.id, userId)

      // 创建临时文件地址
      const temppath1 = this.storageService.createTempFilePath('.wav')

      // 文字转音频
      this.userlogger.log(`正在将文字‘${text}’转成音频...`)
      await this.useTTS({
        txt: text,
        filepath: temppath1,
        speed: speed | 1
      })
        .then(async () => {
          // 合成成功，将正确内容替换回去
          fragment.transcript = Array.from(text)
          this.userlogger.log(`转化成功，正在计算合成音频时长...`)
          const duration = await this.ffmpegService.calculateDuration(temppath1)
          this.userlogger.log(`计算时长成功，合成音频时长为：${duration}`)

          //  清理静音
          // FIXME: 静音清理存在问题，可能会把过短的音频处理掉，比如 “呱” 合成的语音还有 “哈撒给”的“哈”会被裁剪掉
          this.userlogger.log(`正在清理合成音频中首部的静音段...`)
          const temppath2 = this.storageService.createTempFilePath('.wav')
          await this.ffmpegService.clearSilence(temppath1, temppath2)

          // 格式化音频文件
          await this.ffmpegService.audioformat(temppath2, filepath)
          // console.log(filepath)

          /** 计算合成音频的时长 */
          fragment.duration = await this.ffmpegService.calculateDuration(filepath)
          this.userlogger.log(`清理后音频时长：${fragment.duration}`)
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
            // await this.projectService.updateFragment(procedureId, fragment, userId)
            await this.fragmentsRepository.save(fragment)
          }
        })
        .catch(async error => {
          console.log(`语音合成失败：${error.message}`)
          await this.projectService.removeErrorFragment(procedureId, fragmentId, userId)
          throw error
        })
      // console.log(fragment)
      this.userlogger.log(`合成语音创建片段成功！`)
      fragment.audio = filepath // 替换成完整地址返回给前端
      return fragment
    } catch (error) {
      console.log(`创建片段失败：${error.message}`)
      this.userlogger.error(`创建片段失败，错误原因：${error.message} `)
      throw error
    }
  }

  async createByAudio(
    createASRFragmentDto: { procedureId: string; audio: string; duration: number; role: number },
    userId: string,
    dirname: string
  ) {
    const { procedureId, audio, duration, role } = createASRFragmentDto
    try {
      this.userlogger.log(`正在为项目${procedureId}创建音频转文本片段...`)
      if (!audio || !procedureId || !dirname) {
        console.log('输入错误, 缺少必要参数!')
        throw new Error('输入错误, 缺少必要参数！')
      }
      if (duration === 0 || Number(duration) === 0) {
        throw new Error('音频时长为 0 秒，录入音频数据失败，请检查录音设备是否存在问题')
      }
      const procudure = await this.projectService.findOneById(procedureId, userId)
      if (!procudure) throw new Error('找不到项目工程文件！')

      const fragment = new Fragment()
      fragment.id = UUID.v4()
      fragment.userId = userId
      fragment.project = procudure
      fragment.audio = ''
      fragment.duration = Number(duration)
      fragment.txt = ''
      fragment.transcript = ['该片段语音识别/合成中因异常跳出而产生的，看见时请将此片段删除'] // Array.from(text)
      fragment.tags = []
      fragment.promoters = []
      fragment.timestamps = []
      fragment.role = Number(role) || 9999
      fragment.removed = RemovedEnum.NEVER

      // 先添加到项目工程文件中（占位）
      this.userlogger.log(`向 ${procedureId} 项目 'sequence' 中添加 ${fragment.id} 片段...`)
      await this.projectService.addFragment(procedureId, fragment.id, userId)

      // const d1 = await this.ffmpegService.calculateDuration(audio)

      // 清理静音
      this.userlogger.log(`正在清理录制音频中首部的静音段，清理前音频时长为：${fragment.duration}`)
      const temppath = this.storageService.createTempFilePath('.wav')
      await this.ffmpegService.clearSilence(audio, temppath)
      // const d2 = await this.ffmpegService.calculateDuration(temppath)
      // console.log([d1, d2])

      // 创建音频地址
      const { filename, filepath } = this.storageService.createFilePath({
        dirname: [dirname, procudure.dirname],
        category: 'audio',
        originalname: fragment.id,
        extname: '.wav'
      })
      fragment.audio = filename

      // 格式化音频文件
      await this.ffmpegService.audioformat(temppath, filepath)

      // 重新计算处理后音频的时长
      fragment.duration = await this.ffmpegService.calculateDuration(filepath)
      this.userlogger.log(`静音清理后音频时长为：${fragment.duration}`)

      // 语音识别
      await this.sherpaService
        .asr(filepath)
        .then(async result => {
          if (result) {
            this.userlogger.log(`语音识别成功，转写文本为: ${result.text}`)
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
            await this.fragmentsRepository.save(fragment)
          } else {
            this.storageService.deleteSync(filepath)
            throw new Error('语音识别失败！')
          }
        })
        .catch(async error => {
          console.log(`语音识别失败：${error.message}`)
          this.userlogger.log(`语音识别失败，错误原因：${error.message} `)
          this.storageService.deleteSync(filepath)
          await this.projectService.removeErrorFragment(procedureId, fragment.id, userId)
          throw error
        })
      fragment.audio = filepath
      return fragment
    } catch (error) {
      this.userlogger.error(`创建片段失败，错误原因：${error.message} `)
      throw error
    }
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
    fragment.userId = userId
    fragment.audio = ''
    fragment.duration = Number(duration)
    fragment.txt = text.join('')
    fragment.transcript = Array.from(text)
    fragment.tags = new Array(text.length).fill(null)
    fragment.promoters = new Array(text.length).fill(null)
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
            .addFragment(procedureId, fragment.id, userId)
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
    try {
      const fragment = await this.fragmentsRepository.findOneBy({ id: fragmentId })
      if (fragment.transcript.length !== newTranscript.length) {
        throw new Error('更新片段转写文本失败,原片段转写文本数量与新文本长度不一致')
      }
      fragment.transcript = newTranscript
      const result = await this.fragmentsRepository.save(fragment)
      this.userlogger.log(
        `修改片段[${fragmentId}]转写文本成功，原文本：【${fragment.transcript}】，新文本：【${newTranscript}】`
      )
      return { updateAt: result.updateAt, msg: '更新片段转写文本成功！' }
    } catch (error) {
      this.userlogger.log(`修改片段[${fragmentId}]转写文本失败，目标文本：${newTranscript}`)
      throw error
    }
  }

  /** 更新片段标记：（可批量更新） */
  async updateTags(updateFragmentsTagsDto: UpdateFragmentsTagsDto, userId: string) {
    try {
      const { procedureId, newData } = updateFragmentsTagsDto
      const data = newData.map(i => {
        const fragment = {
          id: i.fragmentId,
          tags: i.tags
        }
        return fragment
      })
      const arr = data.map(async item => {
        const fragment = await this.fragmentsRepository.findOneBy({ id: item.id, userId, removed: RemovedEnum.NEVER })
        if (fragment) {
          fragment.tags = item.tags
          return await this.fragmentsRepository.save(fragment)
        }
        return null
      })
      await Promise.all(arr)
      return { msg: '更新片段标记成功！', pdateAt: new Date() }
    } catch (error) {
      this.userlogger.log(`更新片段标记失败，错误原因：${error.message} `)
      throw error
    }
  }

  async remove(removeFragmentDto: RemoveFragmentDto, userId: string) {
    const { procedureId, fragmentId } = removeFragmentDto
    try {
      const result = await this.fragmentsRepository.findOneBy({ id: fragmentId, userId, removed: RemovedEnum.NEVER })
      if (result) {
        result.removed = RemovedEnum.ACTIVE
        await this.fragmentsRepository.save(result)
        await this.projectService.removeFragment(procedureId, fragmentId, userId)
        this.userlogger.log(`移除片段[${fragmentId}]成功,片段已移至回收站！`)
        return { updateAt: result.updateAt, msg: '移除片段成功！' }
      } else {
        throw new Error('找不到目标片段！')
      }
    } catch (error) {
      this.userlogger.log(`移除片段[${fragmentId}]失败,错误原因：${error.message} `)
      throw error
    }
  }

  async restore(restoreFragmentDto: RestoreFragmentDto, userId: string) {
    const { procedureId, fragmentId } = restoreFragmentDto
    try {
      const fragment = await this.fragmentsRepository.findOneBy({ id: fragmentId, userId, removed: RemovedEnum.ACTIVE })
      if (fragment) {
        fragment.removed = RemovedEnum.NEVER
        await this.fragmentsRepository.save(fragment)
        await this.projectService.restoreFragment(procedureId, fragmentId, userId)
        this.userlogger.log(`恢复片段[${fragmentId}]成功,片段已从回收站恢复！`)
        return { updateAt: fragment.updateAt, msg: '恢复片段成功！' }
      } else {
        throw new Error('找不到目标片段！')
      }
    } catch (error) {
      this.userlogger.log(`恢复片段[${fragmentId}]失败,错误原因：${error.message} `)
      throw error
    }
  }

  async delete(deleteFragmentDto: DeleteFragmentDto, userId: string, dirname: string) {
    const { procedureId, fragmentId } = deleteFragmentDto
    try {
      const procedure = await this.projectService.findOneById(procedureId, userId)
      const fragment = await this.fragmentsRepository.findOneBy({ id: fragmentId, userId })
      const authname = fragment.audio
      await this.fragmentsRepository.remove(fragment)
      // 删除片段对应的音频文件
      const filepath = this.storageService.getFilePath({
        filename: authname,
        dirname: [dirname, procedure.dirname],
        category: 'audio'
      })
      this.storageService.deleteSync(filepath)
      await this.projectService.deleteFragment(procedureId, fragmentId, userId)
    } catch (error) {
      this.userlogger.error(`删除片段[${fragmentId}]失败`, error.message)
      throw error
    }
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
