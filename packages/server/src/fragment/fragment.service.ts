import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateTTSFragmentDto } from './dto/create-tts-fragment.dto'
import { Fragment, FragmentSpeaker } from './entities/fragment.entity'
import { StorageService } from 'src/storage/storage.service'
import { RemovedEnum } from 'src/enum'
import fs from 'fs'
import {
  AddPromoterDto,
  DeleteFragmentDto,
  RemoveFragmentDto,
  RemovePromoterDto,
  RestoreFragmentDto,
  UpdateFragmentsTagsDto,
  UpdateSequenceDto,
  UpdateTranscriptDto,
  CreateASRFragmentDto,
  Action,
  CreateSegmentFragmentDto
} from './dto'
import { SherpaService } from 'src/sherpa/sherpa.service'
import { CreateBlankFragmentDto } from './dto/create-blank-fragment.dto'
import { ProjectService } from 'src/project/project.service'
import { FfmpegService } from 'src/ffmpeg/ffmpeg.service'
import { CopyFragmentDto } from './dto/copy-fragment'
import { uuidv7 } from 'uuidv7'
import { LoggerService } from 'src/logger/logger.service'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { DataSource, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
// import fs from 'fs'
import fsx from 'fs-extra'
import { Speaker } from 'src/speaker/entities/speaker.entity'
import { SpeakerService } from 'src/speaker/speaker.service'
// import sharp from 'sharp'
// import Jimp from 'jimp'
import { basename } from 'path'
import { UploadService } from 'src/upload/upload.service'
import { UserService } from 'src/user/user.service'
import { TencentService } from 'src/tencent/tencent.service'
import { TtsModel, AsrModel } from 'src/enum'

/** 根据用户是否为 vip 选择模型 */
function getModel(isVip: boolean, type: 'human' | 'machine') {
  return type === 'human' ? (isVip ? AsrModel.Tencent :AsrModel.Local) : (isVip ? TtsModel.Tencent : TtsModel.Local)
}

@Injectable()
export class FragmentService {
  constructor(
    @InjectRepository(Fragment)
    private fragmentsRepository: Repository<Fragment>,
    private readonly dataSource: DataSource,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly speakerService: SpeakerService,
    private readonly storageService: StorageService,
    private readonly uploadService: UploadService,
    private readonly ffmpegService: FfmpegService,
    private readonly sherpaService: SherpaService,
    private readonly userlogger: UserLoggerService,
    private readonly tencentService: TencentService,
    private readonly logger: LoggerService
  ) {}

  async getFragmentSpeaker(speakerId: string, type: 'human' | 'machine', userId: string, dirname: string, isVip: boolean) {
    try {
      let fragmentSpeaker: FragmentSpeaker
      if (speakerId) {
        const speaker = await this.speakerService.findOneById(speakerId, userId, dirname)
        if (speaker) {
          fragmentSpeaker = {
            id: speakerId,
            type,
            model: speaker.model,
            name: speaker.name,
            avatar: speaker.avatar,
            role: speaker.role,
            changer: speaker.changer,
            speed: speaker.speed
          }
        } else {
          fragmentSpeaker = {
            id: '',
            type,
            model: getModel(isVip, type),
            name: '',
            avatar: '',
            role: 0,
            changer: 0,
            speed: 1
          }
        }
      } else {
      // speakerId 为空字符时，即根据 type 属性确定是 默认用户 或 默认机器人
        fragmentSpeaker = {
          id: '',
          type,
          model: getModel(isVip, type),
          name: '',
          avatar: '',
          role: 0,
          changer: 0,
          speed: 1
        }
      }
      return fragmentSpeaker
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async createByAudio(
    dataArray: {
      key: string
      audio: string
      duration: number
      actions: Action[]
      speakerId: string
    }[],
    procedureId: string,
    userId: string,
    dirname: string,
    isVip: boolean
  ) {
    try {
      const fragments: Fragment[] = []
      const audios: string[] = []
      const keys: string[] = []
      for(let i =0; i < dataArray.length; i++) {
        const data = dataArray[i]
        const { audio, duration, speakerId, actions, key } = data
        if (!audio || !procedureId || !dirname) {
          // console.log('输入错误, 缺少必要参数!')
          throw new Error('输入错误, 缺少必要参数！')
        }
        if (duration === 0 || Number(duration) === 0) {
          throw new Error('音频时长为 0 秒，录入音频数据失败，请检查录音设备是否存在问题')
        }
        const procudure = await this.projectService.findOneById(procedureId, userId)
        if (!procudure) throw new Error('找不到项目工程文件！')

        const fragmentSpeaker = await this.getFragmentSpeaker(speakerId, 'human', userId, dirname, isVip)

        const fragmentId = uuidv7()
        let fragment = new Fragment()
        fragment.id = fragmentId
        fragment.userId = userId
        fragment.project = procudure
        // fragment.audio = basename(audio)
        fragment.duration = Number(duration)
        fragment.txt = ''
        fragment.transcript = ['该片段语音识别/合成中因异常跳出而产生的，看见时请将此片段删除'] // Array.from(text)
        fragment.tags = []
        fragment.promoters = []
        fragment.timestamps = []
        fragment.speaker = fragmentSpeaker
        fragment.removed = RemovedEnum.NEVER
        
        // 先添加到项目工程文件中（占位）
        this.userlogger.log(`向 ${procedureId} 项目 'sequence' 中添加 ${fragmentId} 片段...`)
        await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'add' })

        const temppath = this.storageService.createTempFilePath('.ogg')
        const finalAudio = this.storageService.createTempFilePath('.ogg')
        await this.ffmpegService.convertToOgg(audio, temppath)
        try {
          console.log(`开始语音识别...,音频时长：${duration}`)
          const result = await this.useAsr({ filepath: temppath, model: fragmentSpeaker.model, isVip })
          this.userlogger.log(`语音识别成功，转写文本为: ${result.text}`)
          await this.ffmpegService.audioformat(temppath, finalAudio)
          fragment.audio = basename(finalAudio)
          fragment.txt = result.text
          fragment.timestamps = result.timestamps
          const length = result.tokens?.length
          fragment.transcript = result.tokens
          fragment.tags = new Array(length)
          fragment.promoters = new Array(length)
        } catch (error) {
          console.log(`语音识别失败`)
          this.userlogger.error(`语音识别失败`, error?.message)
          fsx.removeSync(audio)
          await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'error' })
          continue // throw error
        }
        // 添加动作
        if (actions.length > 0) fragment = addPromoter(fragment, actions)

        fragments.push(fragment)
        audios.push(finalAudio)
        keys.push(key)
      }

      if(fragments.length === 0) throw new Error('片段数据为空')

      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      const newFragments: Fragment[] = []

      try {
        for(let j = 0; j < fragments.length; j++) {
          const fragment = fragments[j]
          await this.uploadService.upload(
            {
              file: {
                filename: fragment.audio,
                path: audios[j],
                mimetype: 'audio/ogg'
              },
              quoteId: fragment.id,
              hadExists(url) {
                fragment.audio = basename(url)
              },
            },
            userId,
            dirname,  
          )
          const newFragement = await this.dataSource.manager.save(fragment)
          // 确定创建片段成功后再上传文件
          newFragments.push(newFragement)
        }
        // 提交
        await queryRunner.commitTransaction()
      } catch (error) {
        // console.log('创建片段失败：' + error.message)
        await queryRunner.rollbackTransaction()
        await this.projectService.checkAndCorrectFragmentSquence(procedureId)
        throw error
      } finally {
        await queryRunner.release()
      }
      newFragments.forEach((fragment, index) => {
        fragment['key'] = keys[index]
        fragment.audio = this.storageService.getResponsePath(fragment.audio, dirname)
        fragment.speaker.avatar = this.storageService.getResponsePath(fragment.speaker.avatar, dirname)
      })
      return newFragments
    } catch (error) {
      this.userlogger.error(`创建片段失败`, error.message)
      throw error
    }
  }

  /** 通过文本创建音频片段 */
  async createByText(createTTSFragmentDto: CreateTTSFragmentDto, userId: string, dirname: string, isVip: boolean) {
    try {
      const { procedureId, speakerId, speed, data } = createTTSFragmentDto
      if (speed > 2 || speed <= 0) throw new Error('语速不能大于2或小于等于0')
      if (!procedureId || !dirname) throw new Error('缺少必要参数！')
      const procudure = await this.projectService.findOneById(procedureId, userId)
      if (!procudure) throw new Error('找不到项目工程文件！')
      const fragmentSpeaker = await this.getFragmentSpeaker(speakerId, 'machine', userId, dirname, isVip)
      this.userlogger.log(`正在为项目${procedureId}创建文本转音频片段...`)

      const fragments: Fragment[] = []
      const audios: string[] = []
      const keys: string[] = []
      for (let i = 0; i < data.length; i++) {
        const { key, txt } = data[i]
        if (!txt) throw new Error('文本不能为空！')
        const text = txt.replace(/\s*/g, '')
        const fragmentId = uuidv7()
        // const filepath = this.storageService.createTempFilePath('.wav')
        const fragment = new Fragment()
        fragment.id = fragmentId
        fragment.userId = userId
        fragment.project = procudure
        fragment.audio = ''
        fragment.duration = 0
        fragment.txt = text
        fragment.transcript = ['该片段语音识别/合成中因异常跳出而产生的，看见时请将此片段删除'] // Array.from(text)
        fragment.tags = new Array(text.length).fill(null)
        fragment.promoters = new Array(text.length).fill(null)
        fragment.timestamps = []
        fragment.speaker = fragmentSpeaker
        fragment.removed = RemovedEnum.NEVER

        // 先添加到项目工程文件序列中（占位）
        this.userlogger.log(`向 ${procedureId} 项目 'sequence' 中添加 ${fragmentId} 片段...`)
        await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'add' })

        // 文字转音频
        this.userlogger.log(`正在将文字‘${text}’转成音频...`)
        const finalAudio = this.storageService.createTempFilePath('.ogg')
        try {
          const result = await this.useTTS({
            txt: text,
            model: fragmentSpeaker.model,
            timbre: fragmentSpeaker.role,
            speed: speed || 1,
            isVip
          })
          // 合成成功，将正确内容替换回去
          fragment.transcript = result.data.map(item => item.char)


          // 格式化音频文件 (不同语音合成的音频可能具有不同属性，是否有必要格式化？)
          await this.ffmpegService.audioformat(result.audio, finalAudio)
          // console.log(filepath)

          fragment.audio = basename(finalAudio)
          fragment.duration = result.duration
          fragment.timestamps = result.data.map(item => item.timestamp)
        } catch (error) {
          console.log(`语音合成失败：${error.message}`)
          await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'error' })
          continue // throw error
        }
        if (fragment.audio && fragment.duration !== 0) {
          // console.log(fragment)
          fragments.push(fragment)
          audios.push(finalAudio)
          keys.push(key)
        }
      }

      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      const newFragments: Fragment[] = []
      
      try {
        for(let j = 0; j < fragments.length; j++) {
          const fragment = fragments[j]
          // 先上传文件
          await this.uploadService.upload(
            {
              file: {
                filename: fragment.audio,
                path: audios[j],
                mimetype: 'audio/ogg',
              },
              quoteId: fragment.id,
              hadExists(url) {
                fragment.audio = basename(url)
              },
            },
            userId,
            dirname,
          )
          const newFragement = await this.dataSource.manager.save(fragment)

          newFragments.push(newFragement)
        }
        // 提交
        await queryRunner.commitTransaction()
      } catch (error) {
        console.log('创建片段失败：' + error.message)
        await queryRunner.rollbackTransaction()
        await this.projectService.checkAndCorrectFragmentSquence(procedureId)
        throw error
      } finally {
        await queryRunner.release()
      }
      this.userlogger.log(`合成语音创建片段成功！`)
      newFragments.forEach((fragment, index) => {
        fragment['key'] = keys[index]
        fragment.audio = this.storageService.getResponsePath(fragment.audio, dirname)
        fragment.speaker.avatar = this.storageService.getResponsePath(fragment.speaker.avatar, dirname)
      })
      return newFragments
    } catch (error) {
      console.log(`创建片段失败：${error.message}`)
      this.userlogger.error(`创建片段失败，错误原因：${error.message} `)
      throw error
    }
  }

  async createBlank(dto: CreateBlankFragmentDto, userId: string, dirname: string) {
    try {
      const { procedureId, txtLength, duration, actions } = dto
      const procudure = await this.projectService.findOneById(procedureId, userId)
      if (!procudure) throw new Error('找不到项目工程文件！')
      const text: string[] = []
      for (let i = 0; i < txtLength; i++) {
        text.push('#')
      }
      /** 计算 timestamps */
      const section = duration / txtLength
      const timestamps = text.map((char, index) => {
        return Number((section * index).toFixed(3))
      })
      let fragment = new Fragment()
      fragment.id = uuidv7()
      fragment.userId = userId
      fragment.project = procudure
      fragment.audio = ''
      fragment.duration = Number(duration)
      fragment.txt = text.join('')
      fragment.transcript = Array.from(text)
      fragment.tags = new Array(text.length).fill(null)
      fragment.promoters = new Array(text.length).fill(null)
      fragment.timestamps = timestamps
      fragment.speaker = {
        id: '',
        type: 'machine',
        model: '',
        name: '',
        avatar: '',
        role: 0,
        changer: 0,
        speed: 1
      }
      fragment.removed = RemovedEnum.NEVER

      const filepath = this.storageService.createTempFilePath('.ogg')
      const finalAudio = this.storageService.createTempFilePath('.ogg')
      // 执行FFmpeg命令
      try {
        // 定义FFmpeg命令
        // const ffmpegCommand = `ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t ${duration} ${filepath}`
        // execSync(ffmpegCommand)
        await this.ffmpegService.createBlankAudio(duration, filepath)
        await this.ffmpegService.audioformat(filepath, finalAudio)
      } catch (error) {
        console.error('执行FFmpeg命令出错:', error)
        // this.storageService.deleteSync(filepath)
        fsx.removeSync(filepath)
        throw new Error('空白音频生成失败！')
      }

      fragment.audio = basename(finalAudio)

      if (actions.length > 0) fragment = addPromoter(fragment, actions)
      
      await this.uploadService.upload(
        {
          file: {
            filename: fragment.audio,
            path: finalAudio,
            mimetype: 'audio/ogg',
          },
          quoteId: fragment.id,
          hadExists(url) {
            fragment.audio = basename(url)
          },
        },
        userId,
        dirname,
      )
      const result = await this.fragmentsRepository.save(fragment)
      

      this.userlogger.log(`创建空白片段成功，片段ID为：${result.id}`)
      await this.projectService.updateSequence({ procedureId, fragmentId: fragment.id, userId, type: 'add' })
      result.audio = this.storageService.getResponsePath(result.audio, dirname)
      return result
    } catch (error) {
      console.log(error)
      this.userlogger.error(`创建空白片段失败`, error.message)
      throw error
    }
  }

  async createBySplitFragment(
    dataArray: {
      key: string
      audio: string
      duration: number
      speaker: any
      txt: string
      timestamps: number[]
      transcript: string[]
      tags: string[]
      promoters: string[]
    }[],
    procedureId: string,
    sourceFragmentId: string, // 源片段 id
    removeSourceFragment: boolean,
    userId: string,
    dirname: string,
    isVip: boolean
  ) {
    // this.userlogger.log(`正在创建分段片段：${dto.key}`)
    const sourceFragment = await this.fragmentsRepository.findOneBy({ id: sourceFragmentId, userId })
    const fragments = []
    const audios = []
    const keys = []
    for (const data of dataArray) {
      const { audio, duration, speaker, txt, timestamps, transcript, tags, promoters, key } = data
      // 从前端获取的 speaker.avatar 是完整路径，处理截取出文件名
      const fragmentId = uuidv7() // 先创建 Fragment ID
      // 先添加到项目工程文件中（占位）
      this.userlogger.log(`向 ${procedureId} 项目 'sequence' 中添加 ${fragmentId} 片段...`)
      await this.projectService.updateSequence({ 
        procedureId,
        fragmentId: sourceFragmentId,
        userId,
        type: 'insert',
        insertFragmentId: fragmentId,
        insertPosition: 'after',
      })
      
      const procudure = await this.projectService.findOneById(procedureId, userId)

      const oggPath = this.storageService.createTempFilePath('.ogg')
      const finalAudio = this.storageService.createTempFilePath('.ogg')
      await this.ffmpegService.convertToOgg(audio, oggPath)
      await this.ffmpegService.audioformat(oggPath, finalAudio)

      const fragment = new Fragment()
      fragment.id = fragmentId
      fragment.userId = userId
      fragment.project = procudure
      fragment.audio = basename(finalAudio)  // 因为文件名不会改变，所以我们这里直接截取文件名即可
      fragment.duration = duration
      fragment.txt = txt
      fragment.transcript = transcript
      fragment.tags = tags
      fragment.promoters = promoters
      fragment.timestamps = timestamps
      fragment.speaker = sourceFragment.speaker
      fragment.removed = RemovedEnum.NEVER

      audios.push(finalAudio)
      fragments.push(fragment)
      keys.push(key)
    }

    try {
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      try {
        for (let i = 0; i < fragments.length; i++) {
          await this.uploadService.upload(
            {
              file:  {
                filename: fragments[i].audio,
                path: audios[i],
                mimetype: 'audio/ogg'
              },
              quoteId: fragments[i].id,
              // 如果文件已经存在，则会返回该文件的 url
              hadExists: (url) => {
                fragments[i].audio = basename(url)
                // audios[i] = url
              }
            },
            userId,
            dirname,
          )
          
          await queryRunner.manager.save(fragments[i])
        }
        // 提交
        await queryRunner.commitTransaction()
      } catch (error) {
        console.log('创建片段失败：' + error.message)
        await this.projectService.checkAndCorrectFragmentSquence(procedureId)
        // await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'error' })
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        await queryRunner.release()
      }

      return fragments.map((fragment, index) => {
        const { project, userId, ...fragmentWithoutProject } = fragment
        return {
          key: keys[index],
          ...fragmentWithoutProject,
          audio: this.storageService.getResponsePath(fragmentWithoutProject.audio, dirname),
          speaker: {
            ...fragmentWithoutProject.speaker,
            avatar: this.storageService.getResponsePath(fragmentWithoutProject.speaker.avatar, dirname)
          }
        }
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /** 创建指定片段 */
  async create(fragment: Fragment) {
    try {
      const isExits = await this.fragmentsRepository.existsBy({ id: fragment.id })
      if (isExits) {
        this.userlogger.log(`片段 ${fragment.id} 已存在,无法对其执行创建操作！`)
        return
      }
      await this.fragmentsRepository.save(fragment)
    } catch (error) {
      throw error
    }
  }

  async useAsr(args: { filepath: string; model: string, isVip: boolean }) {
    try {
      const { filepath, model, isVip } = args
      if (model === AsrModel.Local) {
        const result = await this.sherpaService.asr(filepath)
        const punText = await this.sherpaService.addPunct(result.text)
        const alignResult = this.sherpaService.align(punText, result)
        return alignResult
      }
      if(model === AsrModel.Tencent) {
        if(!isVip) {
          throw new Error('免费用户无法使用会员语音识别')
        }
        const result = await this.tencentService.asr(filepath)
        return result
      }
      throw new Error('不支持目标语音服务！')
    } catch (error) {
      throw error
    }
  }

  async useTTS(args: { txt: string;  model: string, timbre?: number; speed?: number, isVip: boolean }) {
    const { txt, model, timbre, speed, isVip } = args
    if (txt.length === 0) throw '文本为空！'
    const temppath = this.storageService.createTempFilePath('.wav')
    // 本地合成
    if(model === TtsModel.Local) {
      await this.sherpaService.tts(txt, temppath, timbre, speed)
      const transcript = Array.from(txt)
      // 清理静音 FIXME: 静音清理存在问题，可能会把过短的音频处理掉，比如 “呱” 合成的语音还有 “哈撒给”的“哈”会被裁剪掉 
      const temppath2 = this.storageService.createTempFilePath('.wav')
      await this.ffmpegService.clearSilence(temppath, temppath2)
      const oggPath = this.storageService.createTempFilePath('.ogg')
      await this.ffmpegService.convertToOgg(temppath2, oggPath)
      fsx.removeSync(temppath2)
      // 计算时长
      const duration = await this.ffmpegService.calculateDuration(oggPath)
      /** 计算 timestamps */
      const section = duration / transcript.length
      const data = transcript.map((char, index) => {
        const timestamp = Number((section * index).toFixed(3))
        return {
          char,
          timestamp,
        }
      })
      return { duration, data, audio: temppath2 }
    }
    // 会员语音合成
    if(model === TtsModel.Tencent) {
      if(!isVip) {
        throw new Error('免费用户无法使用付费语音合成')
      }
      const result = await this.tencentService.tts(txt, timbre, speed)
      const buffer = Buffer.from(result.Audio, 'base64')
      fs.writeFileSync(temppath, buffer)
      const oggPath = this.storageService.createTempFilePath('.ogg')
      await this.ffmpegService.convertToOgg(temppath, oggPath)
      // 计算音频时长
      const duration = await this.ffmpegService.calculateDuration(oggPath)
      const data = result.Subtitles.map(item => {
        return {
          char: item.Text,
          timestamp: item.BeginTime / 1000
        }
      }).filter(item => item.char !== '')
      return { duration, data, audio: oggPath }
    }
    throw new Error('不支持目标语音服务！')
  }

  async updateTranscript(updateTranscriptDto: UpdateTranscriptDto, userId: string) {
    const { procedureId, fragmentId, newTranscript } = updateTranscriptDto
    try {
      const fragment = await this.fragmentsRepository.findOneBy({ id: fragmentId })
      if (fragment.transcript.length !== newTranscript.length) {
        throw new Error('更新片段转写文本失败,原片段转写文本数量与新文本长度不一致')
      }
      fragment.transcript = newTranscript
      fragment.txt = newTranscript.join('')
      const result = await this.fragmentsRepository.save(fragment)
      this.userlogger.log(
        `修改片段[${fragmentId}]转写文本成功，原文本：【${fragment.transcript}】，新文本：【${newTranscript}】`
      )
      this.projectService.updateTime(procedureId, userId)
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

  async updateCollapse(id: string, collapse: boolean, userId: string) {
    try {
      const fragment = await this.fragmentsRepository.findOneBy({ id, userId })
      fragment.collapsed = collapse
      const result = await this.fragmentsRepository.save(fragment)
      return { updateAt: result.updateAt }
    } catch (error) {
      console.log(error)
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
        await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'remove' })
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
        await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'restore' })
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
      // const procedure = await this.projectService.findOneById(procedureId, userId)
      const fragment = await this.fragmentsRepository.findOneBy({ id: fragmentId, userId })
      // const authname = fragment.audio
      await this.fragmentsRepository.remove(fragment)
      // 删除片段对应的音频文件
      // const filepath = this.storageService.getFilePath({
      //   filename: authname,
      //   dirname: [dirname, procedure.dirname],
      //   category: 'audio'
      // })
      // this.storageService.deleteSync(filepath)
      await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'delete' })
      await this.storageService.deleteFile(fragment.audio, fragment.id, userId, dirname)
    } catch (error) {
      this.userlogger.error(`删除片段[${fragmentId}]失败`, error.message)
      throw error
    }
  }

  async addPromoter(addPromoterDto: AddPromoterDto, userId: string) {
    const { procedureId, fragmentId, promoterIndex, promoterSerial, promoterId } = addPromoterDto
    try {
      const fragment = await this.fragmentsRepository.findOneBy({ id: fragmentId, userId })
      fragment.promoters[promoterIndex] = promoterId
      fragment.tags[promoterIndex] = promoterSerial
      await this.fragmentsRepository.save(fragment)
      this.userlogger.log(`片段[${fragmentId}]添加启动子[${promoterId}]成功`)
      this.projectService.updateTime(procedureId, userId)
      return { updateAt: new Date(), msg: '添加启动子成功！' }
    } catch (error) {
      this.userlogger.error(`片段[${fragmentId}]添加启动子[${promoterId}]失败`, error.message)
      throw error
    }
  }

  async removePromoter(removePromoterDto: RemovePromoterDto, userId: string) {
    const { procedureId, fragmentId, promoterIndex } = removePromoterDto
    try {
      const fragment = await this.fragmentsRepository.findOneBy({ id: fragmentId, userId })
      fragment.promoters[promoterIndex] = null
      fragment.tags[promoterIndex] = null
      await this.fragmentsRepository.save(fragment)
      this.userlogger.log(`片段[${fragmentId}]移除启动子[${promoterIndex}]成功`)
      this.projectService.updateTime(procedureId, userId)
      return { updateAt: new Date(), msg: '移除启动子成功！' }
    } catch (error) {
      this.userlogger.error(`片段[${fragmentId}]移除启动子[${promoterIndex}]失败`, error.message)
      throw error
    }
  }

  async moveFragment(updateSequenceDto: UpdateSequenceDto, userId: string) {
    const { procedureId, fragmentId, oldIndex, newIndex } = updateSequenceDto
    try {
      await this.projectService.updateSequence({
        procedureId,
        fragmentId,
        userId,
        type: 'move',
        oldIndex,
        newIndex
      })
      this.userlogger.log(`更新项目[${procedureId}]片段[${fragmentId}]顺序成功`)
      return { updateAt: new Date(), msg: '更新片段顺序成功！' }
    } catch (error) {
      this.userlogger.error(`更新片段[${fragmentId}]顺序失败`, error.message)
      throw error
    }
  }

  async copy(dto: CopyFragmentDto, userId: string, dirname: string) {
    const { sourceProjectId, targetProjectId, sourceFragmentId, targetFragmentId, position, type } = dto
    // eslint-disable-next-line prettier/prettier
    this.userlogger.log(
      `从[${sourceProjectId}]${type}片段[${sourceFragmentId}]到[${targetProjectId}]的片段[${targetFragmentId}]${position}位置`
    )
    try {
      if (sourceProjectId === targetProjectId && sourceFragmentId === targetFragmentId && type === 'cut') {
        throw new Error('不能自己剪切自己,操作无意义')
      }
      const sourceFragment = await this.fragmentsRepository.findOne({
        where: { id: sourceFragmentId, userId },
        relations: ['project']
      })

      // 原项目目录
      // const sourceProjectDirname = sourceFragment.project.dirname

      // 剪切的情况
      if (type === 'cut') {
        if (sourceProjectId === targetProjectId) {
          // 这种情况等价于移动片段位置, 仅修改片段排序信息即可
          // 取出片段
          await this.projectService.updateSequence({
            procedureId: sourceProjectId,
            fragmentId: sourceFragmentId,
            userId,
            type: 'extract'
          })
          // 插入片段
          await this.projectService.updateSequence({
            procedureId: targetProjectId,
            fragmentId: targetFragmentId,
            userId,
            type: 'insert',
            insertFragmentId: sourceFragmentId,
            insertPosition: position
          })
        } else {
          const targetProject = await this.projectService.findOneById(targetProjectId, userId)
          // 修改实体关系
          sourceFragment.project = targetProject
          // 修改排序信息
          // 取出片段
          await this.projectService.updateSequence({
            procedureId: sourceProjectId,
            fragmentId: sourceFragmentId,
            userId,
            type: 'extract'
          })
          await this.projectService.updateSequence({
            procedureId: targetProjectId,
            fragmentId: targetFragmentId,
            userId,
            type: 'insert',
            insertFragmentId: sourceFragmentId,
            insertPosition: position
          })

          // 移动至其它项目时重置启动子状态
          sourceFragment.promoters.fill(null)
          sourceFragment.tags.fill(null)

          // 更新音频文件数据库引用记录
          await this.storageService.updateQuote(sourceFragment.audio, sourceFragment.id, targetFragmentId, userId)

          // 移动音频文件
          // const audiopath = this.storageService.getFilePath({
          //   filename: sourceFragment.audio,
          //   dirname: dirname,
          // })
          // const { filename, filepath } = this.storageService.createFilePath({
          //   dirname: [dirname, targetProject.dirname],
          //   category: 'audio',
          //   originalname: sourceFragment.id,
          //   extname: '.wav'
          // })
          // this.userlogger.log(`片段剪切：源音频位置：${audiopath}, 目标音频位置${filepath}`)
          // fs.renameSync(audiopath, filepath)
          // sourceFragment.audio = filename

          // 复制 speaker avatar 文件
          // const sourceAvatarPath = this.storageService.getFilePath({
          //   filename: sourceFragment.speaker.avatar,
          //   dirname: [dirname, sourceProjectDirname],
          //   category: 'image'
          // })
          // const targetAvatarPath = this.storageService.getFilePath({
          //   filename: sourceFragment.speaker.avatar,
          //   dirname: [dirname, targetProject.dirname],
          //   category: 'image'
          // })
          // if (!fs.existsSync(targetAvatarPath)) {
          //   fs.copyFileSync(sourceAvatarPath, targetAvatarPath)
          // }
        }
        const result = await this.fragmentsRepository.save(sourceFragment)
        result.audio = this.storageService.getResponsePath(result.audio, dirname)
        result.speaker.avatar = this.storageService.getResponsePath(result.speaker.avatar, dirname)
        // result.audio = this.storageService.getFilePath({
        //   filename: sourceFragment.audio,
        //   dirname: [dirname, sourceFragment.project.dirname], // 如果是非相同项目的情况下，实体关系已经变成 sourceFragment.project ==>> targetProject
        //   category: 'audio'
        // })
        // result.speaker.avatar = this.storageService.getFilePath({
        //   dirname: [dirname, sourceFragment.project.dirname], // 如果是非相同项目的情况下，实体关系已经变成 sourceFragment.project ==>> targetProject
        //   category: 'image',
        //   filename: result.speaker.avatar
        // })
        this.userlogger.log(`剪切片段[${sourceFragmentId}]成功！`)
        return result
      } else {
        // 复制的情况
        const newFragment = new Fragment()
        const { id, project, audio, ...entityData } = sourceFragment
        Object.assign(newFragment, entityData)
        newFragment.id = uuidv7()
        newFragment.promoters.fill(null)
        newFragment.tags.fill(null)

        // 建立实体关系并更新排序信息
        // let targetProjectDirname = ''
        if (sourceProjectId === targetProjectId) {
          newFragment.project = project
          await this.projectService.updateSequence({
            procedureId: targetProjectId,
            fragmentId: targetFragmentId,
            userId,
            type: 'insert',
            insertFragmentId: newFragment.id,
            insertPosition: position
          })
          // targetProjectDirname = project.dirname
        } else {
          const targetProject = await this.projectService.findOneById(targetProjectId, userId)
          newFragment.project = targetProject
          await this.projectService.updateSequence({
            procedureId: targetProjectId,
            fragmentId: targetFragmentId,
            userId,
            type: 'insert',
            insertFragmentId: newFragment.id,
            insertPosition: position
          })

          // targetProjectDirname = targetProject.dirname

          // 复制 speaker avatar 文件
          // const sourceAvatarPath = this.storageService.getFilePath({
          //   filename: sourceFragment.speaker.avatar,
          //   dirname: [dirname, sourceProjectDirname],
          //   category: 'image'
          // })
          // const targetAvatarPath = this.storageService.getFilePath({
          //   filename: newFragment.speaker.avatar,
          //   dirname: [dirname, targetProject.dirname],
          //   category: 'image'
          // })
          // if (!fs.existsSync(targetAvatarPath)) {
          //   fs.copyFileSync(sourceAvatarPath, targetAvatarPath)
          // }
        }

        // 复制文件/添加引用记录
        newFragment.audio = audio
        await this.storageService.copyFile(audio, newFragment.id, userId)

        // 复制音频
        // const audioPath = this.storageService.getFilePath({
        //   dirname: [dirname, sourceProjectDirname],
        //   filename: audio,
        //   category: 'audio'
        // })
        // const { filename: newAudioName, filepath: newAudioPath } = this.storageService.createFilePath({
        //   dirname: [dirname, targetProjectDirname],
        //   originalname: newFragment.id,
        //   category: 'audio',
        //   extname: '.wav'
        // })
        // this.storageService.copyFileSync(audioPath, newAudioPath)
        // newFragment.audio = newAudioName
        const result = await this.fragmentsRepository.save(newFragment)
        // result.audio = newAudioPath
        result.audio = this.storageService.getResponsePath(result.audio, dirname)
        result.speaker.avatar = this.storageService.getResponsePath(result.speaker.avatar, dirname)
        // result.speaker.avatar = this.storageService.getFilePath({
        //   dirname: [dirname, targetProjectDirname],
        //   category: 'image',
        //   filename: result.speaker.avatar
        // })
        this.userlogger.log(`复制片段[${sourceFragmentId}]成功！`)
        return result
      }
    } catch (error) {
      this.projectService.checkAndCorrectFragmentSquence(sourceProjectId) // 校验片段序列
      sourceProjectId !== targetProjectId && this.projectService.checkAndCorrectFragmentSquence(targetProjectId) // 校验片段序列
      this.userlogger.error(`${type}片段失败`, error.message)
      throw error
    }
  }
}

function findEmptySlot(promoters: string[], index: number) {
  // 向前查找
  for (let i = index - 1; i >= 0; i--) {
    if (promoters[i] === null) {
      return i
    }
  }

  // 向后查找
  for (let i = index + 1; i < promoters.length; i++) {
    if (promoters[i] === null) {
      return i
    }
  }

  // 没有找到空闲位置
  return -1
}

function findClosestIndex(arr: number[], target: number): number {
  let left = 0
  let right = arr.length - 1
  let closestIndex = -1
  let minDiff = Number.MAX_VALUE // 初始化为最大差异

  if (arr.length === 0) {
    return -1
  }

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (arr[mid] === target) {
      return mid // 如果找到目标值，直接返回索引
    } else if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }

    // 更新最接近的索引和最小差异
    if (Math.abs(arr[mid] - target) < minDiff) {
      minDiff = Math.abs(arr[mid] - target)
      closestIndex = mid
    }
  }

  // 如果没有找到目标值，返回最接近的索引
  return closestIndex
}

function addPromoter(fragment: Fragment, actions: Action[]) {
  const minTimestamp = Math.min(...fragment.timestamps)
  // console.log('minTimestamp', minTimestamp)
  const maxTimestamp = Math.max(...fragment.timestamps)
  // console.log('maxTimestamp', maxTimestamp)
  for (let i = 0; i < actions.length; i++) {
    const { animeId, serial, keyframe } = actions[i]
    // 确认 keyframe 是否在音频范围内
    if (keyframe > fragment.duration) continue

    // 比最小的时间戳更小的情况(左侧无元素)
    if (keyframe < minTimestamp) {
      // 下一个 action 的 keyframe 肯定比当前的大，使用 minTimestamp 查找位置能确保后一个 action 的 timestamp 始终比前一个的大，确保插入顺序
      const position = fragment.timestamps.indexOf(minTimestamp)
      fragment.timestamps.splice(position, 0, keyframe)
      fragment.tags.splice(position, 0, serial)
      fragment.transcript.splice(position, 0, '#')
      fragment.promoters.splice(position, 0, animeId)
      continue
    }

    // 比最大的时间戳更大的情况(右侧无元素)
    if (keyframe > maxTimestamp) {
      // 同理，下一个 action 的 keyframe 肯定比当前的大，所以直接使用 push
      fragment.timestamps.push(keyframe)
      fragment.tags.push(serial)
      fragment.transcript.push('#')
      fragment.promoters.push(animeId)
      continue
    }

    let closestIndex = findClosestIndex(fragment.timestamps, keyframe)
    // 排除空字符的情况，否则会把标记添加到空字符上，导致前端排版错误
    if (!fragment.promoters[closestIndex] && fragment.transcript[closestIndex] !== ' ') {
      fragment.promoters[closestIndex] = animeId
      fragment.tags[closestIndex] = serial
      continue
    }

    // 如果 index 处已经被占用，向前检查
    // for (let i = index - 1; i >= 0; i--) {
    //   if (fragment.promoters[i] === null) {
    //     fragment.promoters[i] = animeId
    //     fragment.tags[i] = serial
    //     isBinding = true
    //     break
    //   }
    // }
    // if (isBinding) continue

    // 如果 index 处已经被占用，向后检查空余位置
    let isBinding = false
    for (let i = closestIndex + 1; i < fragment.timestamps.length; i++) {
      if (!fragment.promoters[i] && fragment.transcript[i] !== ' ') {
        fragment.promoters[i] = animeId
        fragment.tags[i] = serial
        isBinding = true
        break
      }
    }
    if (isBinding) continue

    if (keyframe === fragment.timestamps[closestIndex]) {
      if (fragment.timestamps[closestIndex + 1]) {
        // 先取到与下一个时间戳中间位置作为新的时间戳
        let newKeyframe =
          fragment.timestamps[closestIndex] +
          (fragment.timestamps[closestIndex + 1] - fragment.timestamps[closestIndex]) / 2
        // 如果新的时间戳还大于下一个 action 的 keyframe, 那么就改为取到当前时间戳到下一个 keyframe 之间的位置
        if (actions[i] && newKeyframe > actions[i].keyframe) {
          newKeyframe =
            fragment.timestamps[closestIndex] + (actions[i].keyframe - fragment.timestamps[closestIndex]) / 2
        }
        fragment.timestamps.splice(closestIndex + 1, 0, newKeyframe)
        fragment.tags.splice(closestIndex + 1, 0, serial)
        fragment.transcript.splice(closestIndex + 1, 0, '#')
        fragment.promoters.splice(closestIndex + 1, 0, animeId)
        continue
      }
      // 如果 index + 1 已经没有了，那意味着是最后一个元素了
      // 如果没有下一个动作，则取到最后一个时间戳到结束时间之间的位置
      let newKeyframe = fragment.timestamps[closestIndex] + (fragment.duration - fragment.timestamps[closestIndex]) / 2
      // 如果还有下一个动作，则取到下一个动作之间的时间
      if (actions[i + 1]) {
        newKeyframe =
          fragment.timestamps[closestIndex] + (actions[i + 1].keyframe - fragment.timestamps[closestIndex]) / 2
      }
      fragment.timestamps.splice(closestIndex + 1, 0, newKeyframe)
      fragment.tags.splice(closestIndex + 1, 0, serial)
      fragment.transcript.splice(closestIndex + 1, 0, '#')
      fragment.promoters.splice(closestIndex + 1, 0, animeId)
      continue
    }
    // if (keyframe < fragment.timestamps[index]) {
    //   fragment.timestamps.splice(index, 0, keyframe)
    //   fragment.transcript.splice(index, 0, '#')
    //   fragment.promoters.splice(index, 0, animeId)
    //   continue
    // }
    // if (keyframe > fragment.timestamps[index]) {
    //   fragment.timestamps.splice(index + 1, 0, keyframe)
    //   fragment.transcript.splice(index + 1, 0, '#')
    //   fragment.promoters.splice(index + 1, 0, animeId)
    // }
    const insertIndex = keyframe < fragment.timestamps[closestIndex] ? closestIndex : closestIndex + 1
    fragment.timestamps.splice(insertIndex, 0, keyframe)
    fragment.tags.splice(insertIndex, 0, serial)
    fragment.transcript.splice(insertIndex, 0, '#')
    fragment.promoters.splice(insertIndex, 0, animeId)
  }

  return fragment
}

// function findClosestIndex(arr: number[], target: number): number {
//   let left = 0
//   let right = arr.length - 1

//   // 当数组为空时，返回 -1 表示没有找到
//   if (arr.length === 0) {
//     return -1
//   }

//   // 二分查找，找到接近 target 的位置
//   while (left < right) {
//     const mid = Math.floor((left + right) / 2)

//     if (arr[mid] === target) {
//       return mid // 如果找到精确匹配的元素
//     } else if (arr[mid] < target) {
//       left = mid + 1
//     } else {
//       right = mid
//     }
//   }

//   // 到此处，left 和 right 应该指向相同的元素，即 arr[left] 或 arr[right]

//   // 如果 target 比数组中的最小值还小
//   if (left === 0) {
//     return 0
//   }

//   // 如果 target 比数组中的最大值还大
//   if (left === arr.length) {
//     return arr.length - 1
//   }

//   // 比较 left 和 left - 1 之间哪个更接近 target
//   const closestLeft = arr[left - 1]
//   const closestRight = arr[left]

//   if (Math.abs(closestLeft - target) <= Math.abs(closestRight - target)) {
//     return left - 1
//   } else {
//     return left
//   }
// }

// async createByAudio1(
//   createASRFragmentDto: { procedureId: string; audio: string; duration: number; speakerId: string },
//   userId: string,
//   dirname: string
// ) {
//   const { procedureId, audio, duration, speakerId } = createASRFragmentDto
//   try {
//     this.userlogger.log(`正在为项目${procedureId}创建音频转文本片段...`)
//     if (!audio || !procedureId || !dirname) {
//       console.log('输入错误, 缺少必要参数!')
//       throw new Error('输入错误, 缺少必要参数！')
//     }
//     if (duration === 0 || Number(duration) === 0) {
//       throw new Error('音频时长为 0 秒，录入音频数据失败，请检查录音设备是否存在问题')
//     }
//     const procudure = await this.projectService.findOneById(procedureId, userId)
//     if (!procudure) throw new Error('找不到项目工程文件！')

//     const fragmentSpeaker = await this.getFragmentSpeaker(speakerId, 'human', userId, dirname)

//     const fragmentId = UUID.v4()
//     const fragment = new Fragment()
//     fragment.id = fragmentId
//     fragment.userId = userId
//     fragment.project = procudure
//     fragment.audio = ''
//     fragment.duration = Number(duration)
//     fragment.txt = ''
//     fragment.transcript = ['该片段语音识别/合成中因异常跳出而产生的，看见时请将此片段删除'] // Array.from(text)
//     fragment.tags = []
//     fragment.promoters = []
//     fragment.timestamps = []
//     fragment.speaker = fragmentSpeaker
//     fragment.removed = RemovedEnum.NEVER
//     // 先添加到项目工程文件中（占位）
//     this.userlogger.log(`向 ${procedureId} 项目 'sequence' 中添加 ${fragmentId} 片段...`)
//     await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'add' })

//     // const d1 = await this.ffmpegService.calculateDuration(audio)

//     // 清理静音
//     this.userlogger.log(`正在清理录制音频中首部的静音段，清理前音频时长为：${fragment.duration}`)
//     const temppath = this.storageService.createTempFilePath('.wav')
//     await this.ffmpegService.clearSilence(audio, temppath)
//     // const d2 = await this.ffmpegService.calculateDuration(temppath)
//     // console.log([d1, d2])

//     // 创建音频地址
//     // const { filename, filepath } = this.storageService.createFilePath({
//     //   dirname: dirname,
//     //   category: 'audio',
//     //   originalname: fragmentId,
//     //   extname: '.wav'
//     // })
//     const filepath = this.storageService.createTempFilePath('.wav')
//     fragment.audio = basename(filepath)

//     // 格式化音频文件
//     await this.ffmpegService.audioformat(temppath, filepath)

//     // 重新计算处理后音频的时长
//     fragment.duration = await this.ffmpegService.calculateDuration(filepath)
//     this.userlogger.log(`静音清理后音频时长为：${fragment.duration}`)

//     // 语音识别
//     await this.sherpaService
//       .asr(filepath)
//       .then(async result => {
//         if (result) {
//           const punText = await this.sherpaService.addPunct(result.text)
//           // console.log(punText)
//           const data = this.sherpaService.align(punText, result)
//           this.userlogger.log(`语音识别成功，转写文本为: ${result.text}`)

//           fragment.txt = data.text
//           fragment.timestamps = data.timestamps
//           const length = data.tokens?.length
//           fragment.transcript = data.tokens
//           fragment.tags = new Array(length)
//           fragment.promoters = new Array(length)
//         }
//         if (filepath && fragment.duration !== 0) {
//           // TODO 这里应该用事务确保音频文件上传成功，否则应该回滚
//           await this.fragmentsRepository.save(fragment)
//           // 确定创建片段成功后再上传文件
//           await this.uploadService.upload(
//             {
//               filename: fragment.audio,
//               path: filepath,
//               mimetype: 'audio/wav'
//             },
//             userId,
//             dirname,
//             fragment.id
//           )
//         } else {
//           fsx.removeSync(filepath)
//           throw new Error('语音识别失败！')
//         }
//       })
//       .catch(async error => {
//         console.log(`语音识别失败：${error.message}`)
//         this.userlogger.log(`语音识别失败，错误原因：${error.message} `)
//         fsx.removeSync(filepath)
//         await this.projectService.updateSequence({ procedureId, fragmentId, userId, type: 'error' })
//         throw error
//       })
//     fragment.audio = this.storageService.getResponsePath(fragment.audio, dirname)
//     fragment.speaker.avatar = this.storageService.getResponsePath(fragmentSpeaker.avatar, dirname)
//     return fragment
//   } catch (error) {
//     this.userlogger.error(`创建片段失败，错误原因：${error.message} `)
//     throw error
//   }
// }
