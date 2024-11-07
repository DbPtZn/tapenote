/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { Annotation, Memo, Project, ProjectBGM } from './entities/project.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository, DataSource } from 'typeorm'
import { StorageService } from 'src/storage/storage.service'
import { LibraryEnum, RemovedEnum } from 'src/enum'
import { Fragment } from 'src/fragment/entities/fragment.entity'
import { UpdateTitleDto } from './dto/update-title.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { UpdateSidenoteContentDto } from './dto/update-sidenote-content.dto'
import { FfmpegService } from 'src/ffmpeg/ffmpeg.service'
import path, { basename, extname } from 'path'
import fs from 'fs'
import fsx from 'fs-extra'
import { uuidv7 } from 'uuidv7'
import randomstring from 'randomstring'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'
import { FolderService } from 'src/folder/folder.service'
import { UpdateSpeakerHistoryDto } from './dto/update.dto'
import { AddSubmissionHistoryDto } from './dto/add-submission.dts'
import { SnapshotService } from 'src/snapshot/snapshot.service'
import { InputProjectDto } from './dto/input-project.dto'
import { User } from 'src/user/entities/user.entity'
import { commonConfig } from 'src/config'
import { ConfigService } from '@nestjs/config'
import { UploadService } from 'src/upload/upload.service'
import { AddMemoDto, DeleteMemoDto, UpdateMemoContentDto, UpdateMemoStateDto } from './dto/memo.dto'
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
  bgm?: ProjectBGM
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

interface ProjectCard {
  id: string
  lib: string
  firstPicture: string
  title: string
  abbrev: string
  duration: number
  createAt: Date
  folder: {
    id: string
    name: string
  }
}

const __rootdirname = process.cwd()
@Injectable()
export class ProjectService {
  private readonly common: ReturnType<typeof commonConfig>
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // @InjectRepository(Fragment)
    // private fragmentsRepository: Repository<Fragment>,
    // @Inject(forwardRef(() => FragmentService))
    // private readonly fragmentService: FragmentService,
    @Inject(forwardRef(() => FolderService))
    private readonly folderService: FolderService,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
    private readonly ffmpegService: FfmpegService,
    private readonly snapshotService: SnapshotService,
    private readonly configService: ConfigService,
    private readonly userlogger: UserLoggerService,
    private readonly logger: LoggerService,
    private readonly uploadService: UploadService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
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
        bgm: null,
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
          bgm: note.bgm || null,
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
          bgm: procedure.bgm || null,
          wordage: procedure.detail?.wordage || 0,
          filesize: procedure.detail?.filesize || 0
        }
      }

      const folder = await this.folderService.findOneById(folderId, userId)
      const project = new Project()
      project.id = uuidv7()
      project.lib = lib
      // project.dirname = await this.generateDirname(dirname)
      project.folderId = folderId
      project.folder = folder
      project.userId = userId
      project.title = data.title || ''
      project.content = data.content || '<br>'
      project.abbrev = data.abbrev || ''
      project.memos = []
      project.removed = RemovedEnum.NEVER

      project.detail = {
        penname: penname || '佚名',
        homepage: homepage || '',
        email: email || '',
        wordage: data.wordage || 0,
        filesize: data.filesize || 0
      }
      project.submissionHistory = []

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
          break
        case LibraryEnum.COURSE:
          project.sidenote = data.sidenote || ''
          project.annotations = data.annotations || []
          const { fromNoteId, audio, duration, promoterSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence } =
            await this.generateCourse(project.id, procedureId, dirname, userId)
          project.fromNoteId = fromNoteId
          procedureId && (project.fromProcedureId = procedureId)
          project.audio = basename(audio) || ''
          project.duration = duration || 0
          project.promoterSequence = promoterSequence || []
          project.keyframeSequence = keyframeSequence || []
          project.subtitleSequence = subtitleSequence || []
          project.subtitleKeyframeSequence = subtitleKeyframeSequence || []
          break
      }
      const result = await this.projectsRepository.save(project)
      result.audio = this.storageService.getResponsePath(result.audio, dirname)
      if (!result) {
        throw new Error(`创建项目失败！`)
      }
      // 创建课程的时候会自动创建一个快照版本
      if (lib === LibraryEnum.COURSE) {
        await this.snapshotService.create(result.id, userId)
      }
      this.userlogger.log(`创建 [${lib}] 新项目成功，项目id：${result.id}`)
      return result
    } catch (error) {
      throw error
    }
  }

  /** 生成动画数据 */
  async generateCourse(
    courseId: string,
    procedureId: string,
    dirname: string,
    userId: string
  ) {
    try {
      const procedure = await this.projectsRepository.findOne({ where: { id: procedureId, userId }, relations: ['fragments'] })
      // 片段排序
      // console.log('procedure', procedure)
      const order = procedure.sequence.map(item => item) // string 类型 不支持直接使用 sort 进行排序
      // console.log('order', order)
      // throw '测试'
      const fragments = procedure.fragments
        .filter(fragment => fragment.removed === RemovedEnum.NEVER)
        .sort((a, b) => {
          return order.indexOf(a.id) - order.indexOf(b.id)
        })
      
      // 对音频路径进行处理
      for(const fragment of fragments) {
        // 对于远程路径，先下载到本地后再进行拼接
        if(this.common.enableCOS) {
          const localpath = this.storageService.createTempFilePath('.wav')
          await this.storageService.fetchRemoteFile(fragment.audio, dirname, localpath)
          fragment.audio = localpath
        } else {
          fragment.audio = this.storageService.getFilePath(fragment.audio, dirname)
        }
      }
      

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

      // 创建临时地址
      const tempPath = this.storageService.createTempFilePath('.ogg')

      // 拼接音频片段
      try {
        await this.ffmpegService.concatAudioToOgg(group.audioFragments, tempPath)
      } catch (error) {
        console.log(error)
        throw new Error('拼接音频失败！')
      }
        
      // 完成拼接后将云存储缓存到本地的音频片段删除
      if(this.common.enableCOS) {
        group.audioFragments.forEach(path => fs.unlinkSync(path))
      }

      /** 计算合成音频的时长 */
      const duration = await this.ffmpegService.calculateDuration(tempPath)
      console.log(`合成音频时长：${duration}, 片段总时长：${accumDuration}`)

      // 适配移动浏览器 再生成一份 mp3 格式的音频
      const mp3path = this.storageService.createTempFilePath('.mp3', basename(tempPath))
      try {
        await this.ffmpegService.convertToMp3(tempPath, mp3path)
      } catch (error) {
        throw new Error(`音频文件转换失败: ${error.message}`)
      }

      // 存储 mp3 文件 
      await this.uploadService.upload({
        filename: basename(mp3path),
        path: mp3path,
        mimetype: 'audio/mp3'
      }, userId, dirname)

      // 存储 ogg 文件
      const filepath = await this.uploadService.upload(
        {
          filename: basename(tempPath),
          path: tempPath,
          mimetype: 'audio/ogg'
        }, userId, dirname)

      return {
        fromNoteId: procedure.fromNoteId,
        title: procedure.title,
        content: procedure.content,
        abbrev: procedure.abbrev,
        audio: filepath,
        duration,
        promoterSequence,
        keyframeSequence,
        subtitleSequence,
        subtitleKeyframeSequence,
      }
    } catch (error) {
      throw error
    }
  }

  /** 在制定 course 上创建新版本时，自动覆盖原 course */
  async coverCourse(courseId: string, procedureId: string, userId: string, dirname: string) {
    try {
      const course = await this.projectsRepository.findOne({ where: { id: courseId, userId } })
      if (!course) throw new Error(`课程项目不存在！`)
      const {
        title,
        content,
        abbrev,
        audio,
        duration,
        promoterSequence,
        keyframeSequence,
        subtitleSequence,
        subtitleKeyframeSequence
      } = await this.generateCourse(courseId, procedureId, dirname, userId)
      course.title = title
      course.content = content
      course.abbrev = abbrev
      course.audio = basename(audio) || ''
      course.duration = duration || 0
      course.promoterSequence = promoterSequence || []
      course.keyframeSequence = keyframeSequence || []
      course.subtitleSequence = subtitleSequence || []
      course.subtitleKeyframeSequence = subtitleKeyframeSequence || []
      // console.log(content)
      // console.log(course)
      const result = await this.projectsRepository.save(course)
      if (result) {
        const snapshot = await this.snapshotService.create(result.id, userId)
        if (snapshot) {
          result.snapshotId = snapshot.id
          await this.projectsRepository.save(result)
        }
      }
      result.audio = this.storageService.getResponsePath(result.audio, `${dirname}`)
      return result
    } catch (error) {
      throw error
    }
  }

  /** 导入项目（目前仅实现笔记导入） */
  async input(dto: InputProjectDto, userId: string, dirname: string) {
    try {
      const { lib, firstPictrue, title, content, cover, penname, email, homepage } = dto
      checkTitle(title)
      const user = await this.usersRepository.findOneBy({ id: userId })
      // console.log(dto.folderId)
      const folderId = dto.folderId ? dto.folderId : user.dir[lib]
      const folder = await this.folderService.findOneById(folderId, userId)
      const project = new Project()
      // if(!Object.values(LibraryEnum).includes(lib as LibraryEnum))
      const txt = content.replace(/<[^>]+>/g, '')
      project.folderId = folderId
      project.folder = folder
      project.userId = userId
      project.user = user
      project.lib = lib as LibraryEnum
      project.title = title
      project.content = content
      project.abbrev = txt ? txt.slice(0, 100) : ''
      project.firstPicture = firstPictrue || ''
      project.cover = cover || ''
      project.removed = RemovedEnum.NEVER
      project.memos = []

      project.detail = {
        penname: penname || '佚名',
        homepage: homepage || '',
        email: email || '',
        wordage: txt.length,
        filesize: 0
      }

      project.submissionHistory = []
      const result = await this.projectsRepository.save(project)
      return result.id
    } catch (error) {
      throw error
    }
  }

  /** -------------------------------- 查询 ------------------------------------ */
  /** 查询项目：返回项目信息包含提供给客户端使用的文件相对路径 */
  async findOne(id: string, userId: string, dirname: string) {
    try {
      const project = await this.projectsRepository.findOne({
        where: { id, userId, removed: RemovedEnum.NEVER },
        relations: ['fragments', 'folder']
      })
      // 补全路径
      switch (project.lib) {
        case LibraryEnum.NOTE:
          //
          break
        case LibraryEnum.PROCEDURE:
          // 补全片段音频路径
          if (!dirname) throw new Error('未指定 dirname！')
          project.fragments = project.fragments.map(fragment => {
            fragment.audio = this.storageService.getResponsePath(fragment.audio, dirname)
            fragment.speaker.avatar = this.storageService.getResponsePath(fragment.speaker.avatar, dirname)
            return fragment
          })
          break
        case LibraryEnum.COURSE:
          // 补全音频路径
          if (!dirname) throw new Error('未指定 dirname！')
          project.audio = this.storageService.getResponsePath(project.audio, dirname)
          break
      }
      // console.log('project folder:', project.folder)
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
        fragment.audio = this.storageService.getFilePath(fragment.audio, dirname)
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
      course.audio = this.storageService.getFilePath(course.audio, dirname)
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
        return {
          folderName: folder ? folder.name : '',
          ...others
        }
      })
      return data
    } catch (error) {
      throw error
    }
  }

  async findRelevantProjectsById(id: string, userId: string) {
    try {
      // const courses = await this.projectsRepository.find({
      //   where: { fromProcedureId: id, lib: LibraryEnum.COURSE, userId },
      //   relations: ['folder'],
      //   select: {}
      // })
      const projects = await this.projectsRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.folder', 'folder')
        .select([
          'project.id',
          'project.lib',
          'project.firstPicture',
          'project.title',
          'project.abbrev',
          'project.duration',
          'project.detail',
          'project.createAt',
          'folder.id',
          'folder.name'
        ])
        .where('project.fromProcedureId = :id', { id })
        .orWhere('project.fromNoteId = :id', { id })
        .andWhere('project.userId = :userId', { userId })
        .getMany()

      // console.log(projects)
      return projects
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async findParentProjectsById(id: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOneBy({ id, userId })
      
      const parentProjects: ProjectCard[] = []
      if(project.fromNoteId) {
        const note = await this.projectsRepository.findOne({
          where: { id: project.fromNoteId, userId },
          relations: ['folder']
        })
        parentProjects.push({
          id: note.id,
          lib: note.lib,
          firstPicture: note.firstPicture,
          title: note.title,
          abbrev: note.abbrev,
          duration: note.duration,
          createAt: note.createAt,
          folder: {
            id: note.folder.id,
            name: note.folder.name
          }
        })
      }
      
      if(project.fromProcedureId) {
        const procedure = await this.projectsRepository.findOne({
          where: { id: project.fromProcedureId, userId },
          relations: ['folder']
        })
        parentProjects.push({
          id: procedure.id,
          lib: procedure.lib,
          firstPicture: procedure.firstPicture,
          title: procedure.title,
          abbrev: procedure.abbrev,
          duration: procedure.duration,
          createAt: procedure.createAt,
          folder: {
            id: procedure.folder.id,
            name: procedure.folder.name
          }
        })
      }
      // console.log(parentProjects)
      return parentProjects
    } catch (error) {
      throw error
    }
  }

  /** -------------------------------- 查询 ------------------------------------ */

  /** -------------------------------- 更新 ------------------------------------ */
  async updateTitle(updateprojectTitleDto: UpdateTitleDto, userId: string) {
    const { id, title } = updateprojectTitleDto
    try {
      checkTitle(title)
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
    const { id, content, firstPicture } = updateprojectContentDto
    try {
      const project = await this.findOneById(id, userId)
      project.content = content
      firstPicture && (project.firstPicture = firstPicture)
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

  async updateCover(id: string, url: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOneBy({ id, userId })
      project.cover = url
      const newProject = await this.projectsRepository.save(project)
      return {
        updateAt: newProject.updateAt
      }
    } catch (error) {
      throw error
    }
  }

  async updateCoverPosition(id: string, position: number, userId: string) {
    try {
      const project = await this.projectsRepository.findOneBy({ id, userId })
      project.coverPosition = position
      const newProject = await this.projectsRepository.save(project)
      return {
        updateAt: newProject.updateAt
      }
    } catch (error) {
      throw error
    }
  }

  async updateScreenshot(img: string, projectId: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOneBy({ id: projectId, userId })
      project.screenShot = img
      const newProject = await this.projectsRepository.save(project)
      return {
        updateAt: newProject.updateAt
      }
    } catch (error) {
      throw error
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

  async addMemo(dto: AddMemoDto, userId: string) {
    try {
      const { projectId, x, y } = dto
      const project = await this.projectsRepository.findOneBy({ id: projectId, userId })
      const memo: Memo = {
        id: randomstring.generate(8),
        content: '',
        isExpanded: true,
        bgColor: 'yellow',
        height: 300,
        width: 300,
        x,
        y,
        updateAt: new Date(),
        createAt: new Date()
      }
      console.log(memo)
      project.memos 
      ? project.memos.push(memo)
      : project.memos = [memo]
      
      await this.projectsRepository.save(project)
      return memo
    } catch (error) {
      throw error
    }
    
  }
  
  async updateMemoContent(dto: UpdateMemoContentDto, userId: string) {
    try {
      const { memoId, projectId, content } = dto
      const project = await this.projectsRepository.findOneBy({ id: projectId, userId })
      if(!project.memos || project.memos.length === 0) throw new Error('便笺不存在')
      const index = project.memos.findIndex(item => item.id === memoId)
      if (index === -1) throw new Error('便笺不存在')
      project.memos[index].content = content
      project.updateAt = new Date()
      await this.projectsRepository.save(project)
      return ''
    } catch (error) {
      throw error
    }
  }

  async updateMemoState(dto: UpdateMemoStateDto, userId: string) {
    try {
      const  { memoId, projectId, isExpanded, bgColor, height, width, x, y } = dto
      const project = await this.projectsRepository.findOneBy({ id: projectId, userId })
      const index = project.memos.findIndex(item => item.id === memoId)
      if (index === -1) throw new Error('便笺不存在')
      if(isExpanded !== undefined) project.memos[index].isExpanded = isExpanded
      if(bgColor !== undefined) project.memos[index].bgColor = bgColor
      if(height !== undefined) project.memos[index].height = height
      if(width !== undefined) project.memos[index].width = width
      if(x !== undefined) project.memos[index].x = x
      if(y !== undefined) project.memos[index].y = y
      project.updateAt = new Date()
      await this.projectsRepository.save(project)
      // 出现更新 project.memos[index].isExpanded 后，前端刷新获取的数据依旧是未更新前的情况，原因未知（影响不大）
      return { updateAt: project.updateAt }
    } catch (error) {
      throw error
    }
  }

  async deleteMemo(dto: DeleteMemoDto, userId: string) {
    try {
      const { memoId, projectId } = dto
      const project = await this.projectsRepository.findOneBy({ id: projectId, userId })
      const index = project.memos.findIndex(item => item.id === memoId)
      if (index === -1) throw new Error('便笺不存在')
      project.memos.splice(index, 1)
      await this.projectsRepository.save(project)
      return { updateAt: project.updateAt }
    } catch (error) {
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
        relations: ['fragments', 'snapshots']
      })

      // 使用事务来确保所有操作要么全部成功，要么全部撤销
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        // 删除片段
        for (const fragment of project.fragments) {
          await queryRunner.manager.remove(fragment)
        }
        // 删除快照
        for (const snapshot of project.snapshots) {
          await queryRunner.manager.remove(snapshot)
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
      
      // 删除文件失败不影响删除项目，缺点是可能会产生一些文件残余，但不会影响到用户体验

      // 如果是 course，应当删除对应的音频文件
      if (project.lib === LibraryEnum.COURSE) {
        try {
          await this.storageService.deleteFile(project.audio, project.id, userId, dirname)
        } catch (error) {
          console.log(`删除'audio'文件时发生错误` + error)
          this.userlogger.error(`删除项目[${project.id}]的'audio':[${project.audio}]时发生错误`, error.message)
        }
      }

      // 如果是 Procedure ，则找到所有片段并删除对应的音频文件
      if (project.lib === LibraryEnum.PROCEDURE) {
        for (const fragment of project.fragments) {
          try {
            await this.storageService.deleteFile(fragment.audio, fragment.id, userId, dirname)
          } catch (error) {
            console.log(`删除片段对应的音频时发送错误` + error)
            this.userlogger.error(`删除项目[${project.id}]的'fragment.audio':[${fragment.audio}]时发生错误`, error.message)
          }
        }
      }

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
      // const source = await this.findOne(projectId, userId, dirname, ['folder', 'user'], false)
      const source = await this.projectsRepository.findOne({
        where: { id: projectId, userId, removed: RemovedEnum.NEVER },
        relations: ['folder', 'fragments', 'user'],
      })

      if (!source) throw new Error('找不到目标文件！')

      // 先进行克隆
      const target = Object.assign(new Project(), source)

      // 对部分属性进行重写
      target.id = uuidv7()

      // 设置目标文件夹 (目标与源不一样的情况才需要重新设置)
      if (folderId !== source.folderId) {
        target.folderId = folderId
        const newFolder = await this.folderService.findOneById(folderId, userId)
        target.folder = newFolder
      }

      // 如果是 course ，直接复制 audio
      if (target.lib === LibraryEnum.COURSE) target.audio = source.audio

      // 如果是工程，则应该复制 fragments 中的音频，并且每一个 fragment 都要重新生成
      // 相应的 sequence 和 removeSequence 都要重写
      if (target.lib === LibraryEnum.PROCEDURE) {
        target.fragments = [] // 将 target fragments 清空
        for(const fragment of source.fragments) {
          // 先将全部片段信息复制到新片段上（再修改需要变更的内容）
          const newFragment = Object.assign(new Fragment(), fragment)
          // 赋予新 uuid
          newFragment.id = uuidv7()
          // 建立新的实体关系
          // newFragment.project = target
          // 复制文件路径
          newFragment.audio = fragment.audio
          // 复制移除状态
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
            else
              this.userlogger.error(`替换片段的排序时出错，被替换片段[${fragment.id}]在 removedSequence 列表中不存在！`)
          }

          target.fragments.push(newFragment)
        }
  
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
        const newProject = await queryRunner.manager.save(target) // 保存新的实体
        console.log('newProject.fragments.length:', newProject.fragments.length)
        for (const fragment of newProject.fragments) {
          // 建立新的实体关系
          fragment.project = newProject
          await queryRunner.manager.save(fragment) // 保存新的子实体
        }
        await queryRunner.commitTransaction()

        // 复制项目创建成功以后再复制文件

        // 添加 course 音频文件的引用记录
        if (newProject.lib === LibraryEnum.COURSE) {
          try {
            await this.storageService.copyFile(newProject.audio, newProject.id, userId)
          } catch (error) {
            throw new Error('复制音频文件时发生错误')
          }
        }

        // 添加音频文件复制记录
        if (newProject.lib === LibraryEnum.PROCEDURE) {
          for(const fragment of newProject.fragments) {
            // 添加片段的 audio 文件引用记录
            try {
              await this.storageService.copyFile(fragment.audio, fragment.id, userId)
            } catch (error) {
              this.userlogger.error(`复制音频文件时出错，被复制音频文件[${fragment.audio}]不存在！`)
              // fragment.transcript.push('该片段音频文件已丢失！')
            }
            // 添加片段的 speaker 头像文件引用记录 (此类图片永不删除，不需要考虑引用问题)
            // try {
            //   this.storageService.copyFile(fragment.speaker.avatar, fragment.id, userId, dirname)
            // } catch (error) {
            //   console.log(`复制'speaker'头像文件时发生错误` + error)
            //   this.userlogger.error(`复制'speaker'头像文件时出错，被复制文件[${fragment.speaker.avatar}]不存在！`)
            // }
          }
        }

      } catch (error) {
        await queryRunner.rollbackTransaction()
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

  /** -------------------------------- 投稿 -------------------------------- */
  /** 添加投稿历史记录 */
  async addSubmissionHistory(dto: AddSubmissionHistoryDto, userId: string) {
    const { id, ...data } = dto
    try {
      const project = await this.projectsRepository.findOneBy({ id, userId })
      const key = Date.now().toString(16)
      const history = {
        key,
        ...data
      }
      project.submissionHistory ? project.submissionHistory.push(history) : (project.submissionHistory = [history])
      await this.projectsRepository.save(project)
      this.userlogger.log(`添加投稿历史记录成功,项目id:${id}`)
      return { key }
    } catch (error) {
      this.userlogger.error(`添加投稿历史记录失败,项目id:${id}`, error.message)
      throw error
    }
  }

  async removeSubmissionHistory(id: string, key: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOneBy({ id, userId })
      const index = project.submissionHistory.findIndex(item => item.key === key)
      if (index === -1) throw new Error('Submission history not found!')
      project.submissionHistory.splice(index, 1)
      const result = await this.projectsRepository.save(project)
      this.userlogger.log(`删除投稿历史记录成功,项目id:${id}`)
      return { updateAt: result.updateAt }
    } catch (error) {
      this.userlogger.error(`删除投稿历史记录失败,项目id:${id}`, error.message)
      throw error
    }
  }

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
            this.userlogger.error(
              `彻底删除片段[${fragmentId}]出现异常，片段不在项目[${procedureId}]的'removeSequence'中！`
            )
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
            this.userlogger.error(
              `移动片段[${fragmentId}]出现异常，片段在项目[${procedureId}]的'sequence'中的位置与参数'oldIndex'不符！`
            )
            this.userlogger.error(
              `移动片段时的异常状态：${procedure.sequence.join('|')}, index:${index}, oldIndex:${oldIndex}, fragmentId:${fragmentId}, oldIndexFragmentId:${procedure.sequence[oldIndex]}`
            )
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
            // console.log('插入前:', procedure.sequence, '插入位置：', index + 1, '插入id:', insertFragmentId)
            procedure.sequence.splice(index + 1, 0, insertFragmentId)
            // console.log('插入后:', procedure.sequence)
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
      this.userlogger.log(
        `项目[${id}]的片段序列状态：正常片段数量：${fragments.length},移除片段数量：${removedFragments.length},正常排序长度：${project.sequence.length},移除排序长度：${project.removedSequence.length}`
      )
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
  // async generateDirname(userDirname: string) {
  //   let dirname = generateRandomStr()
  //   let projects = await this.projectsRepository.find({ where: { dirname } })
  //   // 校验该地址是否已经存在
  //   let fullPath1 = path.join(__rootdirname, 'public', userDirname, dirname)
  //   let fullPath2 = path.join(__rootdirname, 'private', userDirname, dirname)
  //   while (projects.length > 0 || fs.existsSync(fullPath1) || fs.existsSync(fullPath2)) {
  //     // console.log('该用户文件夹已存在，重新生成')
  //     dirname = generateRandomStr()
  //     projects = await this.projectsRepository.find({ where: { dirname } })
  //     fullPath1 = path.join(__rootdirname, 'public', userDirname, dirname)
  //     fullPath2 = path.join(__rootdirname, 'private', userDirname, dirname)
  //   }
  //   return dirname
  // }
}

/** 生成随机字符串 */
// function generateRandomStr(num = 8) {
//   const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
//   let result = ''

//   for (let i = 0; i < num; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length)
//     result += characters.charAt(randomIndex)
//   }

//   return result
// }

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

/** 检查标题是否合规 */
function checkTitle(title: string) {
  const regex = /[<>:"/\\|?*]/
  if (regex.test(title)) {
    throw new Error('标题中包含非法字符')
  }
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
