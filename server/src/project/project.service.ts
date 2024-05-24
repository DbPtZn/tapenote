/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { Annotation, BGM, Project } from './entities/project.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository, DataSource } from 'typeorm'
import { StorageService } from 'src/storage/storage.service'
import { LibraryEnum, RemovedEnum } from 'src/enum'
import { Fragment } from 'src/fragment/entities/fragment.entity'
import { UpdateTitleDto } from './dto/update-title.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { UpdateSidenoteContentDto } from './dto/update-sidenote-content.dto'
import { FfmpegService } from 'src/ffmpeg/ffmpeg.service'
import path from 'path'
import fs from 'fs'
import fsx from 'fs-extra'
import * as UUID from 'uuid'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'
import { FolderService } from 'src/folder/folder.service'
import { UpdateSpeakerHistoryDto } from './dto/update.dto'
/** 继承数据 */
interface InheritDto {
  title?: string
  content?: string
  abbrev?: string
  wordage?: number
  filesize?: number
  // procedure
  fragments?: Fragment[]
  sequence?: string[]
  removedSequence?: string[]
  bgm: BGM
  // course
  audio?: string
  duration?: number
  promoterSequence?: Array<string>
  keyframeSequence?: Array<number>
  subtitleSequence?: Array<string>
  subtitleKeyframeSequence?: Array<number>
  sidenote?: string
  annotations?: Annotation[]
}

const __rootdirname = process.cwd()
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    // @InjectRepository(Fragment)
    // private fragmentsRepository: Repository<Fragment>,
    // @Inject(forwardRef(() => FragmentService))
    // private readonly fragmentService: FragmentService,
    @Inject(forwardRef(() => FolderService))
    private readonly folderService: FolderService,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
    private readonly ffmpegService: FfmpegService,
    private readonly userlogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {
    // 测试校验功能
    // this.checkAndCorrectFragmentSquence(new string('65f9c02f6c5a54c1b4b249a0'))
  }

  async create(createDto: CreateProjectDto, userId: string, dirname: string) {
    try {
      const { lib, folderId, noteId, procedureId, penname, email, homepage } = createDto
      // title, content, abbrev, wordage, filesize, fragments, sequence, removedSequence, sidenote, annotations
      let data: InheritDto = {
        title: '',
        content: '',
        abbrev: '',
        bgm: { audio: '', name: '', volumn: 1 },
        wordage: 0,
        filesize: 0,
        fragments: [],
        sequence: [],
        removedSequence: [],
        sidenote: '',
        annotations: []
      }
      if (noteId && lib === LibraryEnum.PROCEDURE) {
        const note = await this.projectsRepository.findOneBy({ id: noteId })
        if (!note) throw new Error('未找到该笔记项目，无法创建工程项目')
        data = {
          title: note.title || '',
          content: note.content || '',
          abbrev: note.abbrev || '',
          bgm: note.bgm || { audio: '', name: '', volumn: 1 },
          wordage: note.detail?.wordage || 0,
          filesize: note.detail?.filesize || 0,
          fragments: note.fragments || [],
          sequence: note.sequence || [],
          removedSequence: note.removedSequence || [],
          sidenote: note.sidenote || '',
          annotations: note.annotations || []
        }
      }
      if (procedureId && lib === LibraryEnum.COURSE) {
        const procedure = await this.projectsRepository.findOneBy({ id: procedureId })
        if (!procedure) throw new Error('未找到该工程项目，无法创建课程项目')
        data = {
          title: procedure.title || '',
          content: procedure.content || '',
          abbrev: procedure.abbrev || '',
          bgm: procedure.bgm || { audio: '', name: '', volumn: 1 },
          wordage: procedure.detail?.wordage || 0,
          filesize: procedure.detail?.filesize || 0
        }
      }

      const folder = await this.folderService.findOneById(folderId, userId)
      const project = new Project()
      project.id = UUID.v4()
      project.lib = lib
      project.dirname = await this.generateDirname(dirname)
      project.folderId = folderId
      project.folder = folder
      project.userId = userId
      project.title = data.title || ''
      project.content = data.content || '<br>'
      project.abbrev = data.abbrev || ''
      project.removed = RemovedEnum.NEVER

      project.detail = {
        penname: penname || '佚名',
        homepage: homepage || '',
        email: email || '',
        wordage: data.wordage || 0,
        filesize: data.filesize || 0
      }

      let _audiopath = ''
      switch (lib) {
        case LibraryEnum.NOTE:
          //
          break
        case LibraryEnum.PROCEDURE:
          noteId && (project.fromNoteId = noteId)
          project.fragments = []
          project.sequence = data.sequence || []
          project.removedSequence = data.removedSequence || []
          project.speakerHistory = { human: '', machine: '' }
          // project.speakerRecorder = []
          break
        case LibraryEnum.COURSE:
          noteId && (project.fromNoteId = noteId)
          procedureId && (project.fromProcedureId = procedureId)
          project.sidenote = data.sidenote || ''
          project.annotations = data.annotations || []
          const {
            audio,
            audiopath,
            duration,
            promoterSequence,
            keyframeSequence,
            subtitleSequence,
            subtitleKeyframeSequence
          } = await this.generateCourse(project.id, project.fromProcedureId, dirname, project.dirname)
          _audiopath = audiopath
          project.audio = audio || ''
          project.duration = duration || 0
          project.promoterSequence = promoterSequence || []
          project.keyframeSequence = keyframeSequence || []
          project.subtitleSequence = subtitleSequence || []
          project.subtitleKeyframeSequence = subtitleKeyframeSequence || []
          break
      }
      const result = await this.projectsRepository.save(project)
      _audiopath && (result.audio = _audiopath)
      if (!result) {
        throw new Error(`创建项目失败！`)
      }
      this.userlogger.log(`创建 [${lib}] 新项目成功，项目id：${result.id}`)
      return result
    } catch (error) {
      throw error
    }
  }

  /** 生成微课数据 */
  async generateCourse(courseId: string, procedureId: string, userDirname: string, projectDirname: string) {
    try {
      const procedure = await this.projectsRepository.findOne({ where: { id: procedureId }, relations: ['fragments'] })
      // 片段排序
      // console.log('procedure.sequence', procedure.sequence)
      const order = procedure.sequence.map(item => item) // string 类型 不支持直接使用 sort 进行排序
      // console.log('order', order)
      // throw '测试'
      const fragments = procedure.fragments
        .filter(fragment => fragment.removed === RemovedEnum.NEVER)
        .sort((a, b) => {
          return order.indexOf(a.id) - order.indexOf(b.id)
        })
        .map(fragment => {
          fragment.audio = this.storageService.getFilePath({
            dirname: [userDirname, procedure.dirname],
            filename: fragment.audio,
            category: 'audio'
          })
          return fragment
        })

      const group = {
        audioFragments: [] as string[],
        promoterGroup: [] as string[][],
        keyframeGroup: [] as number[][],
        transcriptGroup: [] as string[][],
        fragmentDurationGroup: [] as number[]
      }
      let accumDuration = 0 // 记录片段序列的累计时长
      fragments.map((fragment, index) => {
        // a.记录所有音频片段的地址
        group.audioFragments.push(fragment.audio)
        // b.记录每个片段的关键帧序列组（二维数组）
        group.keyframeGroup.push(generateFragmentKeyframeSquence(fragment, accumDuration))
        accumDuration += fragment.duration
        // c.记录每个片段的启动子序列组（二维数组）
        group.promoterGroup.push(fragment.promoters.filter(promoter => promoter && promoter.trim()))
        // d.记录每个片段的文字序列组（二维数组）
        group.transcriptGroup.push(fragment.transcript)
        // e.记录每个片段的时长序列（一维数组）
        group.fragmentDurationGroup.push(fragment.duration)
      })

      let promoterSequence: string[] = []
      let keyframeSequence: number[] = []
      let subtitleSequence: string[] = []
      let subtitleKeyframeSequence: number[] = []

      promoterSequence = group.promoterGroup.flat()
      keyframeSequence = group.keyframeGroup.flat()
      const { subtitleGroup, subtitleKeyframeGroup } = subtitleProcessing(
        group.transcriptGroup,
        group.fragmentDurationGroup
      )
      subtitleSequence = subtitleGroup.flat()
      subtitleKeyframeSequence = subtitleKeyframeGroup.flat()

      // 拼接音频片段
      const { filepath, filename } = this.storageService.createFilePath({
        dirname: [userDirname, projectDirname],
        category: 'audio',
        originalname: courseId,
        extname: '.wav'
      })
      // console.log(group.audioFragments)
      await this.ffmpegService
        .concatAudio(group.audioFragments, filepath)
        .then(() => {
          console.log('拼接成功！')
          console.log(filepath)
        })
        .catch(err => {
          console.log(err)
          throw new Error('拼接音频失败！')
        })

      /** 计算合成音频的时长 */
      const duration = await this.ffmpegService.calculateDuration(filepath)
      console.log(`合成音频时长：${duration}, 片段总时长：${accumDuration}`)
      // throw '测试'
      return {
        audio: filename,
        duration,
        promoterSequence,
        keyframeSequence,
        subtitleSequence,
        subtitleKeyframeSequence,
        audiopath: filepath
      }
    } catch (error) {
      throw error
    }
  }

  /** -------------------------------- 查询 ------------------------------------ */
  /** 找到指向项目于： 包含片段、音频完整路径等信息 */
  async findOne(id: string, userId: string, dirname: string, relations = [], isGetFullSpeakerAvatar = true) {
    try {
      relations.includes('fragments') ? '' : relations.push('fragments') // fragments 是默认必选
      const project = await this.projectsRepository.findOne({
        where: { id, userId, removed: RemovedEnum.NEVER },
        relations: relations
      })
      switch (project.lib) {
        case LibraryEnum.NOTE:
          //
          break
        case LibraryEnum.PROCEDURE:
          // 补全片段音频路径
          if (!dirname) throw new Error('未指定 dirname！')
          project.fragments = project.fragments.map(fragment => {
            fragment.audio = this.storageService.getFilePath({
              dirname: [dirname, project.dirname],
              filename: fragment.audio,
              category: 'audio'
            })
            if (isGetFullSpeakerAvatar) {
              fragment.speaker.avatar = this.storageService.getFilePath({
                dirname: [dirname, project.dirname],
                category: 'image',
                filename: fragment.speaker.avatar
              })
            }
            return fragment
          })
          break
        case LibraryEnum.COURSE:
          // 补全音频路径
          if (!dirname) throw new Error('未指定 dirname！')
          project.audio = this.storageService.getFilePath({
            dirname: [dirname, project.dirname],
            filename: project.audio,
            category: 'audio'
          })
          break
      }
      // console.log(project.sequence)
      return project
    } catch (error) {
      throw error
    }
  }

  async findOneById(id: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOneBy({ id, userId })
      return project
    } catch (error) {
      throw new Error(`查询失败,找不到目标项目,项目id:${id}`)
    }
  }

  async findProcudureById(id: string, userId: string, dirname: string) {
    try {
      const procedure = await this.projectsRepository.findOneBy({ id, userId })
      // 补全音频路径
      if (!dirname) throw new Error('未指定 dirname！')
      procedure.fragments = procedure.fragments.map(fragment => {
        const filePath = this.storageService.getFilePath({
          dirname,
          filename: fragment.audio,
          category: 'audio'
        })
        fragment.audio = filePath
        return fragment
      })
      return procedure
    } catch (error) {
      throw error
    }
  }

  async findCourseById(id: string, userId: string, dirname?: string) {
    try {
      const course = await this.projectsRepository.findOneBy({ id, userId })
      if (!course) throw new NotFoundException(`课程项目于不存在！项目id: ${id}`)
      if (!dirname) throw new Error('未指定 dirname！')
      course.audio = this.storageService.getFilePath({
        dirname: [dirname, course.dirname],
        filename: course.audio,
        category: 'audio'
      })
      return course
    } catch (error) {
      throw error
    }
  }

  async findAll(userId: string, lib?: LibraryEnum) {
    if (lib) {
      const projects = await this.projectsRepository.findBy({ userId, lib, removed: RemovedEnum.NEVER })
      return projects
    }
    const projects = await this.projectsRepository.findBy({ userId, removed: RemovedEnum.NEVER })
    return projects
  }

  async findAllFromTrash(userId: string, lib: LibraryEnum) {
    try {
      const projects = await this.projectsRepository.find({
        where: { userId, lib: lib, removed: Not(RemovedEnum.NEVER) },
        select: ['id', 'title', 'abbrev', 'folderId', 'updateAt', 'createAt']
      })
      return projects
    } catch (error) {
      throw error
    }
  }

  async findAllByFolderId(folderId: string, userId: string, lib?: LibraryEnum) {
    // 获取指定库中的项目
    try {
      if (lib) {
        const projects = await this.projectsRepository.find({
          where: { folderId, userId, lib, removed: RemovedEnum.NEVER }
        })
        return projects
      }
      const projects = await this.projectsRepository.find({
        where: { folderId, userId, removed: RemovedEnum.NEVER }
      })
      return projects || []
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async findByUpdateAtDESC(skip: number, take: number, lib: LibraryEnum, userId: string) {
    try {
      const projects = await this.projectsRepository.find({
        where: { userId: userId, lib, removed: RemovedEnum.NEVER },
        relations: ['folder'],
        order: { updateAt: 'DESC' },
        select: ['id', 'title', 'lib', 'abbrev', 'folderId', 'updateAt', 'createAt'],
        skip: skip,
        take: take
      })
      const data = projects.map(project => {
        const { folder, ...others } = project
        const item = {
          folderName: folder ? folder.name : '',
          ...others
        }
        return item
      })
      return data
    } catch (error) {
      throw error
    }
  }

  /** -------------------------------- 查询 ------------------------------------ */

  /** -------------------------------- 更新 ------------------------------------ */
  async updateTitle(updateprojectTitleDto: UpdateTitleDto, userId: string) {
    const { id, title } = updateprojectTitleDto
    try {
      const project = await this.findOneById(id, userId)
      project.title = title
      const newproject = await this.projectsRepository.save(project)
      return { updateAt: newproject.updateAt, msg: '标题更新成功！' }
    } catch (error) {
      this.userlogger.error(`更新标题失败,项目于id:${id},当前标题:${title}`)
      throw error
    }
  }

  async updateContent(updateprojectContentDto: UpdateContentDto, userId: string) {
    const { id, content } = updateprojectContentDto
    try {
      const project = await this.findOneById(id, userId)
      project.content = content
      const txt = content.replace(/<[^>]+>/g, '')
      project.abbrev = txt ? txt.slice(0, 100) : ''
      project.detail.wordage = txt.length
      const newproject = await this.projectsRepository.save(project)
      // eslint-disable-next-line prettier/prettier
      return {
        updateAt: newproject.updateAt,
        abbrev: newproject.abbrev,
        wordage: newproject.detail.wordage,
        msg: '笔记内容更新成功！'
      }
    } catch (error) {
      this.userlogger.error(`更新笔记内容失败,项目id:${id}`)
      throw new Error(`内容更新失败,项目于id:${id}`)
    }
  }

  async updateSidenoteContent(updateSidenoteContentDto: UpdateSidenoteContentDto, userId: string) {
    const { id, content } = updateSidenoteContentDto
    try {
      const course = await this.projectsRepository.findOneBy({ id: id, userId })
      course.sidenote = content
      const newCourse = await this.projectsRepository.save(course)
      return { updateAt: newCourse.updateAt, msg: '旁注更新成功！' }
    } catch (error) {
      this.userlogger.error(`更新旁注失败,项目id:${id}`)
      throw error
    }
  }
  async updateSpeakerHistory(updateSpeakerHistoryDto: UpdateSpeakerHistoryDto, userId: string) {
    const { id, type, speakerId } = updateSpeakerHistoryDto
    try {
      const procedure = await this.projectsRepository.findOneBy({ id, userId })
      if (type === 'human') {
        procedure.speakerHistory.human = speakerId
      }
      if (type === 'machine') {
        procedure.speakerHistory.machine = speakerId
      }
      const result = await this.projectsRepository.save(procedure)
      this.userlogger.log(`更新说话人历史记录成功,项目id:${id},${type}说话人id:${speakerId}`)
      return { updateAt: result.updateAt, msg: '更新成功！' }
    } catch (error) {
      this.userlogger.error(`更新说话人历史记录失败,项目id:${id}`)
      throw error
    }
  }
  /** -------------------------------- 更新 ------------------------------------ */

  /** -------------------------------- 移除与恢复 ------------------------------------ */

  async remove(id: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOneBy({ id, userId })
      project.removed = RemovedEnum.ACTIVE
      const newProject = await this.projectsRepository.save(project)
      return { updateAt: newProject.updateAt, msg: '移除项目成功！' }
    } catch (error) {
      this.userlogger.error(`移除项目失败,项目id:${id}`)
      throw error
    }
  }

  async restore(id: string, folderId: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOneBy({ id, userId })
      if (!project) throw new Error(`恢复项目失败！找不到该目标,项目id: ${id}`)
      project.removed = RemovedEnum.NEVER
      project.folderId = folderId
      const newProject = await this.projectsRepository.save(project)
      return { updateAt: newProject.updateAt, msg: '恢复项目成功！' }
    } catch (error) {
      this.userlogger.error(`恢复项目失败,项目id:${id}`)
      throw error
    }
  }

  async delete(id: string, userId: string, dirname: string) {
    try {
      const project = await this.projectsRepository.findOne({
        where: { id, userId },
        relations: { fragments: true }
      })

      // 使用事务来确保所有操作要么全部成功，要么全部撤销
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        for (const fragment of project.fragments) {
          await queryRunner.manager.remove(fragment)
        }
        await queryRunner.manager.remove(project)
        await queryRunner.commitTransaction()
      } catch (error) {
        console.log('删除项目失败：' + error.message)
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        await queryRunner.release()
      }
      
      const dir = this.storageService.getDocDir({ dir: [dirname, project.dirname] })
      try {
        fsx.removeSync(dir)
      } catch (error) {
        console.log(`删除项目目录时发生错误` + error)
        this.userlogger.error(`删除项目[${project.id}]的目录:[${dir}]时发生错误`, error.message)
        throw error
      }
      // 注：因为现在我改成将 project 相关的文件放在 project.dirname 下，所以当项目彻底删除时只需要删除 project.dirname 目录即可
      // 如果是 course，应当删除对应的音频文件
      // if (project.lib === LibraryEnum.COURSE) {
      //   const filepath = this.storageService.getFilePath({
      //     filename: project.audio,
      //     dirname: [dirname, project.dirname],
      //     category: 'audio'
      //   })
      //   try {
      //     this.storageService.deleteSync(filepath)
      //   } catch (error) {
      //     console.log(`删除'audio'文件时发生错误` + error)
      //     this.userlogger.error(`删除项目[${project.id}]的'audio':[${filepath}]时发生错误`, error.message)
      //   }
      // }

      // 如果是 Procedure ，则找到所有片段并删除对应的音频文件
      // if (project.lib === LibraryEnum.PROCEDURE) {
      //   for (const fragment of project.fragments) {
      //     const filepath = this.storageService.getFilePath({
      //       filename: fragment.audio,
      //       dirname: [dirname, project.dirname],
      //       category: 'audio'
      //     })
      //     try {
      //       this.storageService.deleteSync(filepath)
      //     } catch (error) {
      //       console.log(`删除片段对应的音频时发送错误` + error)
      //       this.userlogger.error(`删除项目[${project.id}]的'fragment.audio':[${filepath}]时发生错误`, error.message)
      //     }
      //   }
      // }
      return { msg: '删除成功！', date: new Date() }
    } catch (error) {
      throw error
    }
  }
  /** -------------------------------- 移除与恢复 ------------------------------------ */

  /** -------------------------------- 移动与复制 ------------------------------------ */
  async move(id: string, folderId: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOneBy({ id, userId })
      project.folderId = folderId
      const newProject = await this.projectsRepository.save(project)
      return { updateAt: newProject.updateAt, msg: '移动项目成功！' }
    } catch (error) {
      this.userlogger.error(`移动项目失败,项目id:${id}`)
      throw error
    }
  }

  async copy(projectId: string, folderId: string, userId: string, dirname: string) {
    try {
      const source = await this.findOne(projectId, userId, dirname, ['folder', 'user'], false)
      if (!source) throw new Error('找不到目标文件！')

      // 先进行克隆
      const target = Object.assign(new Project(), source)

      // 对部分属性进行重写
      target.id = UUID.v4()

      // 设置目标文件夹 (目标与源不一样的情况才需要重新设置)
      if (folderId !== source.folderId) {
        target.folderId = folderId
        const newFolder = await this.folderService.findOneById(folderId, userId)
        target.folder = newFolder
      }

      // 设置目标项目目录
      target.dirname = await this.generateDirname(dirname)

      // 如果是 course ，则应该生成新的音频文件，并且需要更新 audio
      if (target.lib === LibraryEnum.COURSE) {
        // 创建新的音频文件
        const { filename, filepath } = this.storageService.createFilePath({
          dirname: [dirname, target.dirname],
          category: 'audio',
          originalname: target.id,
          extname: '.wav'
        })
        // 复制文件
        await fsx.copyFile(source.audio, filepath)
        target.audio = filename
      }

      // 如果是工程，则应该复制 fragments 中的音频，并且每一个 fragment 都要重新生成
      // 相应的 sequence 和 removeSequence 都要重写
      if (target.lib === LibraryEnum.PROCEDURE) {
        target.fragments = target.fragments.map(fragment => {
          // 克隆 fragment 实体
          const newFragment = Object.assign(new Fragment(), fragment)

          // 赋予新 uuid
          newFragment.id = UUID.v4()

          // 建立新的实体关系
          newFragment.project = target
          
          // 复制音频文件
          const { filename, filepath } = this.storageService.createFilePath({
            dirname: [dirname, target.dirname],
            category: 'audio',
            originalname: newFragment.id,
            extname: '.wav'
          })
          try {
            fsx.copyFileSync(fragment.audio, filepath)
          } catch (error) {
            this.userlogger.error(`复制音频文件时出错，被复制音频文件[${fragment.audio}]不存在！`)
            newFragment.transcript.push('该片段音频文件已丢失！')
          }
          newFragment.audio = filename

          newFragment.removed = fragment.removed

          // 处理排序信息
          if (fragment.removed === RemovedEnum.NEVER) {
            // 获取片段在源项目中的排序位置
            const index = target.sequence.findIndex(item => item === fragment.id)
            if (index !== -1) target.sequence[index] = newFragment.id
            else this.userlogger.error(`替换片段的排序时出错，被替换片段[${fragment.id}]在 sequence 列表中不存在！`)
          }
          if (fragment.removed !== RemovedEnum.NEVER) {
            // 获取移除片段在源项目中的排序位置
            const index = target.removedSequence.findIndex(item => item === fragment.id)
            if (index !== -1) target.removedSequence[index] = newFragment.id
            else this.userlogger.error(`替换片段的排序时出错，被替换片段[${fragment.id}]在 removedSequence 列表中不存在！`)
          }
          return newFragment
        })


        // 复制片段的 speaker 头像文件
        const sourceSpeakerDirPath = this.storageService.getDocDir({
          dir: [dirname, source.dirname],
          category: 'image'
        })
        const targetSpeakerDirPath = this.storageService.getDocDir({
          dir: [dirname, target.dirname],
          category: 'image'
        })
        await fsx.copy(sourceSpeakerDirPath, targetSpeakerDirPath)

        // 校验 sequence 长度和内容是否完成替换
        if (target.sequence.length === source.sequence.length) {
          target.sequence.some(item => source.sequence.includes(item))
        } else {
          this.userlogger.error('替换片段的排序时出错，替换后的 sequence 长度不一致或存在未替换的片段！')
        }
        if (target.removedSequence.length === source.removedSequence.length) {
          target.removedSequence.some(item => source.removedSequence.includes(item))
        } else {
          this.userlogger.error(`替换移除片段的排序时出错，替换后的 removedSequence 长度不一致或存在未替换的片段！`)
        }
      }

      // 使用事务来确保所有操作要么全部成功，要么全部撤销
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        await queryRunner.manager.save(target) // 保存新的实体
        for (const fragment of target.fragments) {
          await queryRunner.manager.save(fragment) // 保存新的子实体
        }
        await queryRunner.commitTransaction()
      } catch (error) {
        await queryRunner.rollbackTransaction()
        await fsx.remove(this.storageService.getDocDir({ dir: [dirname, target.dirname]}))
        this.userlogger.error(`保存克隆实体失败,项目id:${projectId}`, error.message)
        throw error
      } finally {
        await queryRunner.release()
      }

      // console.log(`复制项目成功,源项目id:${projectId}，克隆项目id:${target.id}`)
      this.userlogger.log(`复制项目成功,源项目id:${projectId}，克隆项目id:${target.id}`)
      const newProject = await this.findOne(target.id, userId, dirname)
      return newProject
    } catch (error) {
      // console.log(error)
      this.userlogger.error(`复制项目失败,项目id:${projectId}`, error.message)
      throw error
    }
  }

  /** -------------------------------- 版本控制 ------------------------------------ */
  /** 版本快照 */
  // snapshot(id: string, userId: string) {
  //   const project = this.projectsRepository.findOneBy({ id, userId })
  //   project
  // }

  /** -------------------------------- 片段 ------------------------------------ */
  async updateSequence(args: {
    procedureId: string
    fragmentId: string
    userId: string
    type: 'add' | 'error' | 'remove' | 'restore' | 'delete' | 'move' | 'extract' | 'insert'
    oldIndex?: number
    newIndex?: number
    insertFragmentId?: string
    insertPosition?: 'before' | 'after' | 'insert'
  }) {
    // console.log(args)
    const { procedureId, fragmentId, userId, type, oldIndex, newIndex, insertFragmentId, insertPosition } = args
    try {
      const procedure = await this.projectsRepository.findOneBy({ id: procedureId, userId })
      if (!procedure) throw new Error('找不到对应的工程！')
      const index = ['remove', 'move', 'error', 'extract', 'insert'].includes(type)
        ? procedure.sequence.findIndex(i => i === fragmentId) // remove/move 在 sequence 查询片段
        : procedure.removedSequence.findIndex(i => i === fragmentId) // delete/restore 在 removedSequence 查询片段
      switch (type) {
        case 'add':
          procedure.sequence.push(fragmentId)
          break
        case 'error':
          if (index === -1) {
            this.userlogger.error(`移除错误片段 [${fragmentId}]出现异常，片段不在项目[${procedureId}]的'sequence'中！`)
            return
          }
          procedure.sequence.splice(index, 1)
          break
        case 'remove':
          if (index === -1) {
            this.userlogger.error(`移除片段[${fragmentId}]出现异常，片段不在项目[${procedureId}]的'sequence'中！`)
            return
          }
          procedure.sequence.splice(index, 1)
          procedure.removedSequence.push(fragmentId)
          break
        case 'restore':
          if (index === -1) {
            this.userlogger.error(`恢复片段[${fragmentId}]出现异常，片段不在项目[${procedureId}]的'removeSequence'中！`)
            return
          }
          procedure.removedSequence.splice(index, 1)
          procedure.sequence.push(fragmentId)
          break
        case 'delete':
          if (index === -1) {
            // eslint-disable-next-line prettier/prettier
            this.userlogger.error(`彻底删除片段[${fragmentId}]出现异常，片段不在项目[${procedureId}]的'removeSequence'中！`)
            return
          }
          procedure.removedSequence.splice(index, 1)
          break
        case 'move':
          if (oldIndex === undefined || newIndex === undefined) {
            this.userlogger.error(`移动片段[${fragmentId}]出现异常，未提供有效'oldIndex'或'newIndex'参数！`)
            return
          }
          if (index === -1) {
            this.userlogger.error(`移动片段[${fragmentId}]出现异常，片段不在项目[${procedureId}]的'removeSequence'中！`)
            return
          }
          if (index !== oldIndex || procedure.sequence[oldIndex] !== fragmentId) {
            // eslint-disable-next-line prettier/prettier
            this.userlogger.error(`移动片段[${fragmentId}]出现异常，片段在项目[${procedureId}]的'sequence'中的位置与参数'oldIndex'不符！`)
            this.userlogger.error(`移动片段时的异常状态：${procedure.sequence.join('|')}, index:${index}, oldIndex:${oldIndex}, fragmentId:${fragmentId}, oldIndexFragmentId:${procedure.sequence[oldIndex]}`)
            return
          }
          procedure.sequence.splice(oldIndex, 1)
          procedure.sequence.splice(newIndex, 0, fragmentId)
          break
        case 'extract':
          if (index === -1) {
            this.userlogger.error(`取出片段 [${fragmentId}]出现异常，片段不在项目[${procedureId}]的'sequence'中！`)
            return
          }
          procedure.sequence.splice(index, 1)
          break
        case 'insert':
          if (!insertFragmentId) {
            this.userlogger.error(`插入片段出现异常，参数'insertFragmentId'为空！`)
            return
          }
          if (insertPosition === 'before') {
            procedure.sequence.splice(index, 0, insertFragmentId)
          }
          if (insertPosition === 'after') {
            procedure.sequence.splice(index + 1, 0, insertFragmentId)
          }
          if (insertPosition === 'insert') {
            procedure.sequence.push(insertFragmentId)
          }
          break
      }
      await this.projectsRepository.save(procedure)
    } catch (error) {
      if (type === 'add') {
        this.userlogger.error(`向项目[${procedureId}]的'sequence'中添加片段 [${fragmentId}] 失败！`, error.message)
      }
      throw error
    }
  }

  async updateTime(id: string, userId: string) {
    try {
      await this.projectsRepository.update(
        { id, userId },
        {
          updateAt: new Date()
        }
      )
      this.userlogger.log(`更新项目[${id}]的 'updateAt'成功！`)
    } catch (error) {
      this.userlogger.error(`更新项目[${id}]的 'updateAt'失败！`, error.message)
    }
  }

  // 检查并校正片段序列
  async checkAndCorrectFragmentSquence(id: string) {
    try {
      const project = await this.projectsRepository.findOne({
        where: { id, lib: LibraryEnum.PROCEDURE },
        relations: ['fragments']
      })
      if (!project) return
      this.userlogger.log(`检查并校正项目[${id}]的片段序列...`)
      // 正常片段
      const fragments = project.fragments.filter(fragment => fragment.removed === RemovedEnum.NEVER)
      // 移除片段
      const removedFragments = project.fragments.filter(fragment => fragment.removed !== RemovedEnum.NEVER)
      // eslint-disable-next-line prettier/prettier
      this.userlogger.log(`项目[${id}]的片段序列状态：正常片段数量：${fragments.length},移除片段数量：${removedFragments.length},正常排序长度：${project.sequence.length},移除排序长度：${project.removedSequence.length}`)
      // 正常片段是否全包含于正常序列中
      fragments.forEach(fragment => {
        const isInclude = project.sequence.some(id => id === fragment.id)
        if (!isInclude) {
          console.log(`${fragment.id} 片段未被包含于正常序列中`)
          this.userlogger.warn(`${fragment.id} 片段未被包含于正常序列中`)
          // 将未记录片段 id 添加至正常序列
          project.sequence.push(fragment.id)
        }
      })
      // 移除片段是否全包含于移除序列中
      removedFragments.forEach(fragment => {
        const isInclude = project.removedSequence.some(id => id === fragment.id)
        if (!isInclude) {
          console.log(`${fragment.id} 片段未被包含于移除序列中`)
          this.userlogger.warn(`${fragment.id} 片段未被包含于移除序列中`)
          // 将未记录片段 id 添加至移除序列
          project.removedSequence.push(fragment.id)
        }
      })
      // 正常序列中是否存在异常片段
      project.sequence.forEach((fragmentId, index, arr) => {
        const isInclude = fragments.some(fragment => fragment.id === fragmentId)
        if (!isInclude) {
          console.log(`正常片段中未找到 id 为 ${fragmentId} 的片段`)
          this.userlogger.warn(`正常片段中未找到 id 为 ${fragmentId} 的片段`)
          // 移除异常片段 id
          arr.splice(index, 1)
        }
      })
      // 移除序列中是否存在异常片段
      project.removedSequence.forEach((fragmentId, index, arr) => {
        const isInclude = removedFragments.some(fragment => fragment.id === fragmentId)
        if (!isInclude) {
          console.log(`移除片段中未找到 id 为 ${fragmentId} 的片段`)
          this.userlogger.warn(`移除片段中未找到 id 为 ${fragmentId} 的片段`)
          // 移除异常片段 id
          arr.splice(index, 1)
        }
      })
      await this.projectsRepository.save(project)
    } catch (error) {
      this.userlogger.error(`校正项目[${id}]得片段排序失败 `, error.message)
      throw error
    }
  }
  /** -------------------------------- 片段 ------------------------------------ */

  /** 生成项目专用目录的地址 */
  async generateDirname(userDirname: string) {
    let dirname = generateRandomStr()
    let projects = await this.projectsRepository.find({ where: { dirname } })
    // 校验该地址是否已经存在
    let fullPath1 = path.join(__rootdirname, 'public', userDirname, dirname)
    let fullPath2 = path.join(__rootdirname, 'private', userDirname, dirname)
    while (projects.length > 0 || fs.existsSync(fullPath1) || fs.existsSync(fullPath2)) {
      // console.log('该用户文件夹已存在，重新生成')
      dirname = generateRandomStr()
      projects = await this.projectsRepository.find({ where: { dirname } })
      fullPath1 = path.join(__rootdirname, 'public', userDirname, dirname)
      fullPath2 = path.join(__rootdirname, 'private', userDirname, dirname)
    }
    return dirname
  }
}

/** 生成随机字符串 */
function generateRandomStr(num = 8) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''

  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

/** 生成片段的关键帧序列 */
function generateFragmentKeyframeSquence(fragment: Fragment, accumDuration: number): number[] {
  // const section = fragment.duration / fragment.transcript.length // 计算切片长度
  // 临时创建一个空数组，用于存储片段内的关键帧序列
  return fragment.promoters
    .map((promoter, index) => {
      return promoter ? fragment.timestamps[index] + accumDuration : null
    })
    .filter(i => i !== null)
}

/** 字幕处理 */
function subtitleProcessing(transcriptGroup: string[][], fragmentDurationGroup: number[]) {
  const subtitleGroup = []
  const subtitleKeyframeGroup = []
  const unnecessaryReg = /[\u300a\u300b\u201c\u201d\uff08\uff09\uff5b\uff5d\u3010\u3011]/g // 非必要标点符号正则
  const tailReg = /[\u3002\uff1b\uff0c\uff1f\uff01\u2026]/ //尾部断句标点符号正则
  let accumDuration = 0 // 每个片段字幕的起始时间
  transcriptGroup.forEach((subtitle, index) => {
    // a.将 string[] 合并成一个 string
    let txt = subtitle.join('')
    // b.清除句末标点符号
    if (tailReg.test(txt.charAt(txt.length - 1))) {
      txt = txt.substring(0, txt.length - 1)
    }
    // c.清除文字中的非必要标点符号
    txt = txt.replace(unnecessaryReg, '')
    // d. 对文字进行分割 —— 通过指定符号(断句标点符号，如逗号、分号、句号、感叹号、问号等)进行分割
    const slices = txt.split(tailReg)
    // e. 遍历切割后的片段，计算每个片段的起始时间
    const section = fragmentDurationGroup[index] / txt.length // 音频片段时长 / 总字数 = 平均每个字符的所占的时间切片
    const sliceKeyFrameGroup = [] // 文字切片的关键帧组
    let startTime = accumDuration // 每个片段字幕切片的起始时间
    slices.forEach(slice => {
      if (slice) {
        sliceKeyFrameGroup.push(startTime)
        startTime += slice.length * section // 计算下一个片段的起始时间
      }
    })
    accumDuration += fragmentDurationGroup[index]
    subtitleGroup.push(slices)
    subtitleKeyframeGroup.push(sliceKeyFrameGroup)
  })
  return { subtitleGroup, subtitleKeyframeGroup }
}

// async copyFragment(args: {
//   sourceProejctId: string
//   targetProejctId: string
//   sourceFragmentId: string
//   targetFragmentId: string
//   position: 'before' | 'after'
//   type: 'copy' | 'cut'
//   userId: string
//   dirname: string
// }) {
//   // eslint-disable-next-line prettier/prettier
//   const { sourceFragmentId, targetFragmentId, sourceProejctId, targetProejctId, userId, dirname, position, type } =
//     args
//   // console.log(args)
//   if (sourceProejctId === targetProejctId && sourceFragmentId === targetFragmentId && type === 'cut') {
//     throw new Error('不能自己剪切自己,操作无意义')
//   }
//   const source = await this.projectsRepository.findOneBy({ id: sourceProejctId, userId })
//   const target = await this.projectsRepository.findOneBy({ id: targetProejctId, userId })

//   if (!source) throw new Error('源项目不存在')
//   if (!target) throw new Error('目标项目不存在')
//   const fragment = source.fragments.find(i => i.id === sourceFragmentId)
//   if (!fragment) throw new Error('源片段不存在')
//   // 1. 获取源文件地址
//   const sourceFilepath = this.storageService.getFilePath({
//     filename: fragment.audio,
//     dirname: [dirname, source.dirname],
//     category: 'audio'
//   })
//   const newFragmentId = UUID.v4()
//   // 2. 创建复制文件地址
//   const { filename, filepath: targetFilepath } = this.storageService.createFilePath({
//     dirname: [dirname, target.dirname],
//     originalname: newFragmentId,
//     category: 'audio',
//     extname: '.wav'
//   })
//   // 3. 复制文件
//   try {
//     this.storageService.copyFileSync(sourceFilepath, targetFilepath)
//   } catch (error) {
//     throw new Error('复制文件失败')
//   }
//   // 创建复制片段对象
//   let newFragment = new Fragment()
//   newFragment = Object.assign(newFragment, {
//     id: newFragmentId, // 不复制 id 信息
//     audio: filename, // 新文件名称
//     duration: fragment.duration,
//     txt: fragment.txt,
//     transcript: fragment.transcript,
//     tags: new Array(fragment.transcript.length), // 不复制标记信息
//     promoters: new Array(fragment.transcript.length), // 不复制标记信息
//     timestamps: fragment.timestamps,
//     role: fragment.role,
//     removed: fragment.removed
//   })
//   // 查找目标片段位置
//   // console.log(target)
//   // console.log(targetFragmentId)
//   const index = target.sequence.findIndex(i => i === targetFragmentId)
//   // console.log(index)
//   if (index === -1) throw new Error('目标片段不存在')
//   if (position === 'before') {
//     // 在目标片段之前插入
//     target.sequence.splice(index, 0, newFragment.id)
//   }
//   if (position === 'after') {
//     // 在目标片段之后插入
//     target.sequence.splice(index + 1, 0, newFragment.id)
//   }
//   target.fragments.push(newFragment)
//   if (type === 'cut') {
//     // 剪切模式下，要将源片段移除掉
//     if (sourceProejctId === targetProejctId) {
//       // 如果源项目与目标项目相同，以目标项目数据为准
//       target.fragments.splice(
//         target.fragments.findIndex(i => i.id === fragment.id),
//         1
//       )
//       target.sequence.splice(
//         target.sequence.findIndex(i => i === fragment.id),
//         1
//       )
//     }
//     if (sourceProejctId !== targetProejctId) {
//       // 如果源项目与目标项目不相同的情况，需要移除源项目片段数据
//       source.fragments.splice(
//         source.fragments.findIndex(i => i.id === fragment.id),
//         1
//       )
//       source.sequence.splice(
//         source.sequence.findIndex(i => i === fragment.id),
//         1
//       )
//     }

//     // 删除对应源文件
//     try {
//       this.storageService.deleteSync(sourceFilepath)
//     } catch (error) {
//       console.log('剪切模式-删除源音频文件失败:' + error)
//       // 不阻断进程
//     }
//   }
//   if (sourceProejctId === targetProejctId) {
//     // 源项目与目标项目相同，只需要保存更新目标项目
//     await this.projectsRepository.save(target)
//     this.checkAndCorrectFragmentSquence(target.id) // 校验片段序列
//   }
//   if (sourceProejctId !== targetProejctId) {
//     // 源项目与目标项目不相同，需要同时保存更新源项目与目标项目
//     await Promise.all([this.projectsRepository.save(source), this.projectsRepository.save(target)])
//     this.checkAndCorrectFragmentSquence(source.id) // 校验片段序列
//     this.checkAndCorrectFragmentSquence(target.id) // 校验片段序列
//   }
//   newFragment.audio = targetFilepath
//   return { fragment: newFragment, updateAt: target.updateAt, msg: '复制片段成功！' }
// }
// target.fragments = source.fragments.map(fragment => {
//   let newFragment = new Fragment()
//   newFragment = Object.assign(newFragment, {
//     id: UUID.v4(),
//     project: target,
//     audio: '',
//     duration: fragment.duration,
//     txt: fragment.txt,
//     transcript: fragment.transcript,
//     tags: fragment.tags,
//     promoters: fragment.promoters,
//     timestamps: fragment.timestamps,
//     role: fragment.role,
//     removed: fragment.removed
//   })
//   const { filename, filepath } = this.storageService.createFilePath({
//     dirname: [dirname, target.dirname],
//     category: 'audio',
//     originalname: newFragment.id,
//     extname: '.wav'
//   })
//   // 复制文件
//   try {
//     this.storageService.copyFileSync(fragment.audio, filepath)
//   } catch (error) {
//     throw '复制片段音频的时候出错了！'
//   }
//   newFragment.audio = filename
//   // 处理排序信息
//   if (fragment.removed === RemovedEnum.NEVER) {
//     // 获取片段在源项目中的排序位置
//     const index = target.sequence.findIndex(item => item === fragment.id)
//     if (index !== -1) target.sequence[index] = newFragment.id
//     else throw '替换片段的排序时出错，被替换片段在 sequence 列表中不存在！'
//   }
//   if (fragment.removed !== RemovedEnum.NEVER) {
//     // 获取移除片段在源项目中的排序位置
//     const index = target.removedSequence.findIndex(item => item === fragment.id)
//     if (index !== -1) target.removedSequence[index] = newFragment.id
//     else throw '替换移除片段的排序时出错，被替换片段在 removedSequence 列表中不存在！'
//   }
//   return newFragment
// })
