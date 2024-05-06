import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { Annotation, BGM, Project } from './entities/project.entity'
import { StorageService } from 'src/storage/storage.service'
import { LibraryEnum, RemovedEnum } from 'src/enum'
import { Fragment } from 'src/fragment/entities/fragment.entity'
import { UpdateTitleDto } from './dto/update-title.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { UpdateSidenoteContentDto } from './dto/update-sidenote-content.dto'
import { FfmpegService } from 'src/ffmpeg/ffmpeg.service'
import path from 'path'
import fs from 'fs'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'
import { PouchDBService } from 'src/pouchdb/pouchdb.service'
import * as UUID from 'uuid'
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
// interface CopyDto extends InheritDto {
//   audio?: string
//   duration?: number
//   promoterSequence?: Array<string>
//   keyframeSequence?: Array<number>
//   subtitleSequence?: Array<string>
//   subtitleKeyframeSequence?: Array<number>
// }

const __rootdirname = process.cwd()
@Injectable()
export class ProjectService {
  private projectsRepository: PouchDB.Database<Project>
  constructor(
    private readonly pouchDBService: PouchDBService,
    private readonly storageService: StorageService,
    private readonly ffmpegService: FfmpegService,
    private readonly userlogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {
    // 测试校验功能
    // this.checkAndCorrectFragmentSquence(new string('65f9c02f6c5a54c1b4b249a0'))
    this.projectsRepository = this.pouchDBService.createDatabase('database/projects', { auto_compaction: true })
  }
  async findBy(where: { [key: string]: any }) {
    const keys = Object.keys(where)
    if (keys.length === 0) throw new Error('参数不能为空')
    if (keys.includes('_id') && !where._id) return []
    await this.projectsRepository.createIndex({
      index: {
        fields: keys
      }
    })
    const result = await this.projectsRepository.find({
      selector: {
        $and: keys.map(key => {
          return {
            [key]: where[key]
          }
        })
      }
    })
    return result.docs
  }

  async findOneBy(where: { [key: string]: any }) {
    try {
      const keys = Object.keys(where)
      if (keys.length === 0) throw new Error('参数不能为空')
      if (keys.includes('_id') && !where._id) return null
      await this.projectsRepository.createIndex({
        index: {
          fields: keys
        }
      })
      const result = await this.projectsRepository.find({
        selector: {
          $and: keys.map(key => {
            return {
              [key]: where[key]
            }
          })
        },
        limit: 1
      })
      return result.docs.length > 0 ? result.docs[0] : null
    } catch (error) {
      throw error
    }
  }

  async create(createDto: CreateProjectDto, userId: string, dirname: string) {
    try {
      // eslint-disable-next-line prettier/prettier
      const { library, folderId, noteId, procedureId, penname, email, homepage } = createDto
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
      if (noteId && library === LibraryEnum.PROCEDURE) {
        const note = await this.findOneBy({ _id: noteId })
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
      if (procedureId && library === LibraryEnum.COURSE) {
        const procedure = await this.findOneBy({ _id: procedureId })
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

      const project = new Project()
      project._id = UUID.v4()
      project.library = library
      project.dirname = await this.generateDirname(dirname)
      project.folderId = folderId
      project.userId = userId
      project.title = data.title || ''
      project.content = data.content || '<br>'
      project.abbrev = data.abbrev || ''
      project.removed = RemovedEnum.NEVER
      project.createAt = new Date()
      project.updateAt = new Date()

      project.detail = {
        penname: penname || '佚名',
        homepage: homepage || '',
        email: email || '',
        wordage: data.wordage || 0,
        filesize: data.filesize || 0
      }

      let _audiopath = ''
      switch (library) {
        case LibraryEnum.NOTE:
          //
          break
        case LibraryEnum.PROCEDURE:
          noteId && (project.fromNoteId = noteId)
          project.fragments = []
          project.sequence = data.sequence || []
          project.removedSequence = data.removedSequence || []
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
          } = await this.generateCourse(project._id, project.fromProcedureId, dirname, project.dirname)
          _audiopath = audiopath
          project.audio = audio || ''
          project.duration = duration || 0
          project.promoterSequence = promoterSequence || []
          project.keyframeSequence = keyframeSequence || []
          project.subtitleSequence = subtitleSequence || []
          project.subtitleKeyframeSequence = subtitleKeyframeSequence || []
          break
      }
      await this.projectsRepository.put(project)
      const result = await this.projectsRepository.get(project._id)
      _audiopath && (result.audio = _audiopath)
      if (!result) {
        throw new Error(`创建项目失败！`)
      }
      // this.userlogger.log(`创建 [${library}] 新项目成功，项目id：${result._id}`)
      // this.logger.log(`创建 [${library}] 新项目成功，项目id：${result._id}`)
      return result
    } catch (error) {
      throw error
    }
  }

  /** 生成微课数据 */
  async generateCourse(courseId: string, procedureId: string, userDirname: string, projectDirname: string) {
    const procedure = await this.projectsRepository.get(procedureId)
    // 片段排序
    // console.log('procedure.sequence', procedure.sequence)
    const order = procedure.sequence.map(item => item) // string 类型 不支持直接使用 sort 进行排序
    // console.log('order', order)
    // throw '测试'
    const fragments = procedure.fragments
      .filter(fragment => fragment.removed === RemovedEnum.NEVER)
      .sort((a, b) => {
        return order.indexOf(a._id) - order.indexOf(b._id)
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
  }

  /** -------------------------------- 查询 ------------------------------------ */
  async findOne(_id: string, userId: string, dirname: string) {
    const project = await this.findOneBy({ _id, userId })
    if (!project) throw new Error('未找到该项目')
    switch (project.library) {
      case LibraryEnum.NOTE:
        //
        break
      case LibraryEnum.PROCEDURE:
        // 补全片段音频路径
        if (!dirname) throw new Error('未指定 dirname！')
        project.fragments = project.fragments.map(fragment => {
          const filePath = this.storageService.getFilePath({
            dirname: [dirname, project.dirname],
            filename: fragment.audio,
            category: 'audio'
          })
          fragment.audio = filePath
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
    return project
  }

  async findOneById(_id: string, userId: string) {
    const project = await this.findOneBy({ _id, userId })
    if (project) return project
    else throw new Error(`查询失败,找不到目标项目,项目id:${_id}`)
  }

  async findProcudureById(_id: string, userId: string, dirname: string) {
    const procedure = await this.findOneBy({ _id, userId })
    if (!procedure) throw new Error('未找到该工程项目')
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
  }

  async findCourseById(_id: string, userId: string, dirname?: string) {
    const course = await this.findOneBy({ _id, userId })
    if (!course) throw new NotFoundException(`课程项目于不存在！项目id: ${_id}`)
    if (!dirname) throw new Error('未指定 dirname！')
    course.audio = this.storageService.getFilePath({
      dirname: [dirname, course.dirname],
      filename: course.audio,
      category: 'audio'
    })
    return course
  }

  async findAll(userId: string, library?: LibraryEnum) {
    if (library) {
      const projects = await this.findBy({ userId, library, removed: RemovedEnum.NEVER })
      return projects
    }
    const projects = await this.findBy({ userId, removed: RemovedEnum.NEVER })
    return projects
  }

  async findAllFromTrash(userId: string, lib: LibraryEnum) {
    const projects = await this.projectsRepository.find({
      selector: {
        $and: [{ userId }, { library: lib }, { removed: { $ne: RemovedEnum.NEVER } }]
      },
      fields: ['_id', 'title', 'abbrev', 'folderId', 'updateAt', 'createAt']
    })
    // const projects = await this.projectsRepository.find({
    //   where: { userId, library: lib, removed: { $ne: RemovedEnum.NEVER } },
    //   select: ['_id', 'title', 'abbrev', 'folderId', 'updateAt', 'createAt']
    // })
    return projects.docs
  }

  async findAllByFolderId(folderId: string, userId: string, library?: LibraryEnum) {
    // 获取指定库中的项目
    try {
      if (library) {
        const projects = await this.findBy({ folderId, userId, library, removed: RemovedEnum.NEVER })
        return projects
      }
      const projects = await this.findBy({ folderId, userId, removed: RemovedEnum.NEVER })
      return projects || []
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async findByUpdateAt(skip: number, take: number, library: LibraryEnum, userId: string) {
    await this.projectsRepository.createIndex({
      index: { fields: ['updateAt'] }
    })
    const projects = await this.projectsRepository.find({
      selector: {
        $and: [{ userId: userId }, { library }, { removed: RemovedEnum.NEVER }, { updateAt: { $exists: true } }]
      },
      fields: ['_id', 'title', 'abbrev', 'folderId', 'updateAt', 'createAt'],
      sort: [{ updateAt: 'desc' }],
      skip: skip,
      limit: take
    })
    return projects.docs
  }

  /** -------------------------------- 查询 ------------------------------------ */

  /** -------------------------------- 更新 ------------------------------------ */
  async updateTitle(updateprojectTitleDto: UpdateTitleDto, userId: string) {
    const { id, title } = updateprojectTitleDto
    try {
      const project = await this.findOneById(id, userId)
      project.title = title
      project.updateAt = new Date()
      await this.projectsRepository.put(project)
      return { updateAt: project.updateAt, msg: '标题更新成功！' }
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
      project.updateAt = new Date()
      await this.projectsRepository.put(project)
      return {
        updateAt: project.updateAt,
        abbrev: project.abbrev,
        wordage: project.detail.wordage,
        msg: '笔记内容更新成功！'
      }
    } catch (error) {
      this.userlogger.error(`更新笔记内容失败,项目id:${id}`)
      throw error
    }
  }

  async updateSidenoteContent(updateSidenoteContentDto: UpdateSidenoteContentDto, userId: string) {
    const { id, content } = updateSidenoteContentDto
    try {
      const course = await this.findOneBy({ _id: id, userId })
      if (!course) throw new Error('未找到该课程项目')
      course.sidenote = content
      course.updateAt = new Date()
      await this.projectsRepository.put(course)
      return { updateAt: course.updateAt, msg: '旁注更新成功！' }
    } catch (error) {
      this.userlogger.error(`更新旁注失败,项目id:${id}`)
      throw error
    }
  }

  /** -------------------------------- 更新 ------------------------------------ */

  /** -------------------------------- 移除与恢复 ------------------------------------ */

  async remove(_id: string, userId: string) {
    try {
      const project = await this.findOneBy({ _id, userId })
      if (!project) throw new Error(`移除项目失败！找不到该目标,项目id: ${_id}`)
      project.removed = RemovedEnum.ACTIVE
      project.updateAt = new Date()
      await this.projectsRepository.put(project)
      return { updateAt: project.updateAt, msg: '移除项目成功！' }
    } catch (error) {
      this.userlogger.error(`移除项目失败,项目id:${_id}`)
      throw error
    }
  }

  async restore(_id: string, folderId: string, userId: string) {
    try {
      const project = await this.findOneBy({ _id, userId })
      if (!project) throw new Error(`恢复项目失败！找不到该目标,项目id: ${_id}`)
      project.removed = RemovedEnum.NEVER
      project.folderId = folderId
      project.updateAt = new Date()
      await this.projectsRepository.put(project)
      return { updateAt: project.updateAt, msg: '恢复项目成功！' }
    } catch (error) {
      this.userlogger.error(`恢复项目失败,项目id:${_id}`)
      throw error
    }
  }
  /** -------------------------------- 移除与恢复 ------------------------------------ */

  /** -------------------------------- 移动与复制 ------------------------------------ */
  async move(_id: string, folderId: string, userId: string) {
    try {
      const project = await this.findOneBy({ _id, userId })
      if (!project) throw new Error(`移动项目失败！找不到该目标,项目id: ${_id}`)
      project.folderId = folderId
      project.updateAt = new Date()
      await this.projectsRepository.put(project)
      return { updateAt: project.updateAt, msg: '移动项目成功！' }
    } catch (error) {
      this.userlogger.error(`移动项目失败,项目id:${_id}`)
      throw error
    }
  }

  async copy(_id: string, folderId: string, userId: string, dirname: string) {
    const source = await this.findOne(_id, userId, dirname)
    if (!source) throw '找不到目标文件！'
    let target = new Project()
    // 先进行全量复制
    target = source
    // 对部分属性进行重写
    target._id = UUID.v4()
    // 设置目标文件夹
    target.folderId = folderId
    // 设置目标项目目录
    target.dirname = await this.generateDirname(dirname)

    // 如果是课程，则应该复制 audio
    if (target.library === LibraryEnum.COURSE) {
      // 1. 创建新的音频文件
      const { filename, filepath } = this.storageService.createFilePath({
        dirname: [dirname, target.dirname],
        category: 'audio',
        originalname: target._id,
        extname: '.wav'
      })
      // 2. 复制文件
      try {
        this.storageService.copyFileSync(source.audio, filepath)
      } catch (error) {
        throw '复制 audio 时出错！'
      }
      target.audio = filename
    }
    // 如果是工程，则应该复制 fragments 中的音频，并且每一个 fragment 都要重新生成
    // 相应的 sequence 和 removeSequence 都要重写
    if (target.library === LibraryEnum.PROCEDURE) {
      target.fragments = source.fragments.map(fragment => {
        const newFragment: Fragment = {
          _id: UUID.v4(),
          audio: '',
          duration: fragment.duration,
          txt: fragment.txt,
          transcript: fragment.transcript,
          tags: fragment.tags,
          promoters: fragment.promoters,
          timestamps: fragment.timestamps,
          role: fragment.role,
          removed: fragment.removed
        }
        const { filename, filepath } = this.storageService.createFilePath({
          dirname: [dirname, target.dirname],
          category: 'audio',
          originalname: newFragment._id,
          extname: '.wav'
        })
        // 复制文件
        try {
          this.storageService.copyFileSync(fragment.audio, filepath)
        } catch (error) {
          throw '复制片段音频的时候出错了！'
        }
        newFragment.audio = filename
        // 处理排序信息
        if (fragment.removed === RemovedEnum.NEVER) {
          // 获取片段在源项目中的排序位置
          const index = target.sequence.findIndex(item => item === fragment._id)
          if (index !== -1) target.sequence[index] = newFragment._id
          else throw '替换片段的排序时出错，被替换片段在 sequence 列表中不存在！'
        }
        if (fragment.removed !== RemovedEnum.NEVER) {
          // 获取移除片段在源项目中的排序位置
          const index = target.removedSequence.findIndex(item => item === fragment._id)
          if (index !== -1) target.removedSequence[index] = newFragment._id
          else throw '替换移除片段的排序时出错，被替换片段在 removedSequence 列表中不存在！'
        }
        return newFragment
      })
      // 校验 sequence 长度和内容是否完成替换
      if (target.sequence.length === source.sequence.length) {
        target.sequence.some(item => source.sequence.includes(item))
      } else {
        throw '替换片段的排序时出错，替换后的 sequence 长度不一致或存在未替换的片段！'
      }
      if (target.removedSequence.length === source.removedSequence.length) {
        target.removedSequence.some(item => source.removedSequence.includes(item))
      } else {
        throw '替换移除片段的排序时出错，替换后的 removedSequence 长度不一致或存在未替换的片段！'
      }
    }

    // 其它共有数据
    // target.userId = source.userId
    // target.library = source.library
    // target.title = source.title
    // target.content = source.content
    // target.abbrev = source.abbrev
    // target.removed = source.removed
    // target.detail = source.detail

    // 其它课程数据
    // target.duration = target.duration
    // target.promoterSequence = source.promoterSequence
    // target.keyframeSequence = source.keyframeSequence
    // target.subtitleSequence = source.subtitleSequence
    // target.subtitleKeyframeSequence = source.subtitleKeyframeSequence
    // target.sidenote = source.sidenote
    // target.annotations = source.annotations

    // target.fromProcedureId = source.fromProcedureId
    // target.fromNoteId = source.fromNoteId
    await this.projectsRepository.put(target)
    const newProject = await this.projectsRepository.get(target._id)
    return newProject
  }

  async delete(_id: string, userId: string, dirname: string) {
    try {
      const project = await this.findOneBy({ _id, userId })
      if (!project) throw '找不到目标文件！'
      await this.projectsRepository.remove(project)
      // console.log(result)
      // 如果是课程，则删除对应的音频文件
      if (project.library === LibraryEnum.COURSE) {
        const filepath = this.storageService.getFilePath({
          filename: project.audio,
          dirname: [dirname, project.dirname],
          category: 'audio'
        })
        try {
          this.storageService.deleteSync(filepath)
        } catch (error) {
          console.log(`删除课程对应的音频时发生错误` + error) // 仅打印日志
        }
      }
      // 如果是工程，则找到所有片段并删除对应的音频文件
      if (project.library === LibraryEnum.PROCEDURE) {
        project.fragments.forEach(fragment => {
          const filepath = this.storageService.getFilePath({
            filename: fragment.audio,
            dirname: [dirname, project.dirname],
            category: 'audio'
          })
          try {
            this.storageService.deleteSync(filepath)
          } catch (error) {
            console.log(`删除片段对应的音频时发送错误` + error) // 仅打印日志
          }
        })
      }
      return { msg: '删除成功！', date: new Date() }
    } catch (error) {
      throw error
    }
  }

  /** -------------------------------- 版本控制 ------------------------------------ */
  /** 版本快照 */
  // snapshot(_id: string, userId: string) {
  //   const project = this.projectsRepository.findOneBy({ _id, userId })
  //   project
  // }

  /** -------------------------------- 片段 ------------------------------------ */
  async addFragment(procedureId: string, userId: string, fragment: Fragment) {
    try {
      const procedure = await this.findOneBy({ _id: procedureId, userId })
      if (!procedure) throw new Error('找不到目标工程！')
      procedure.fragments ? procedure.fragments.push(fragment) : (procedure.fragments = [fragment])
      procedure.sequence ? procedure.sequence.push(fragment._id) : (procedure.sequence = [fragment._id])
      procedure.updateAt = new Date()
      await this.projectsRepository.put(procedure)
      return { updateAt: procedure.updateAt, msg: '插入片段成功！' }
    } catch (error) {
      this.userlogger.error(`插入新片段失败,项目id:${procedureId}`, error)
      throw error
    }
  }

  async updateFragment(procedureId: string, data: Fragment, userId: string) {
    try {
      const procedure = await this.findOneBy({ _id: procedureId, userId })
      if (!procedure) throw new Error('找不到目标工程！')
      procedure.fragments.some((fragment, index, arr) => {
        if (fragment._id === data._id) {
          arr[index] = data
          return true
        }
      })
      procedure.updateAt = new Date()
      await this.projectsRepository.put(procedure)
    } catch (error) {
      throw error
    }
  }
  /** 移除错误片段 */
  async removeErrorFragment(procedureId: string, fragmentId: string, userId: string) {
    const procedure = await this.findOneBy({ _id: procedureId, userId })
    if (!procedure) throw new Error('找不到目标工程！')
    procedure.fragments.some((fragment, index, arr) => {
      if (fragment._id === fragmentId) {
        arr.splice(index, 1)
        return true
      }
    })
    procedure.sequence.some((item, index, arr) => {
      if (item === fragmentId) {
        arr.splice(index, 1)
        return true
      }
    })
    procedure.updateAt = new Date()
    await this.projectsRepository.put(procedure)
  }

  async updateFragmentTranscript(procedureId: string, fragmentId: string, newTranscript: string[], userId: string) {
    try {
      const procedure = await this.findOneBy({ _id: procedureId, userId })
      if (!procedure) throw new Error('找不到目标工程！')
      procedure.fragments.some((fragment, index, arr) => {
        if (fragment._id === fragmentId) {
          if (fragment.transcript.length !== newTranscript.length) {
            throw new Error('更新片段转写文本失败,原片段转写文本数量与新文本长度不一致')
          }
          arr[index].transcript = newTranscript
          return true
        }
      })
      procedure.updateAt = new Date()
      await this.projectsRepository.put(procedure)
      return { updateAt: procedure.updateAt, msg: '更新片段转写文本成功！' }
    } catch (error) {
      this.userlogger.error(`更新片段转写文本失败,项目id:${procedureId},片段id:${fragmentId}`, error)
      throw error
    }
  }

  async updateFragmentsTags(
    procedureId: string,
    newData: {
      fragmentId: string
      tags: (string | null)[]
    }[],
    userId: string
  ) {
    try {
      const data = newData.map(i => {
        const fragment = {
          fragmentId: i.fragmentId,
          tags: i.tags
        }
        return fragment
      })
      const procedure = await this.findOneBy({ _id: procedureId, userId })
      if (!procedure) throw new Error('找不到目标工程！')
      procedure.fragments.forEach((fragment, index, arr) => {
        if (fragment.removed === RemovedEnum.NEVER) {
          // 特别注意：数据库中的片段是包含移除状态的，并且无排序，一般从前端传回的数据是排序的，所以不能依据顺序来更新！！！
          const targetIndex = data.findIndex(i => i.fragmentId === fragment._id)
          if (targetIndex !== -1) {
            arr[index].tags = data[targetIndex].tags
          }
        }
      })
      procedure.updateAt = new Date()
      await this.projectsRepository.put(procedure)
      return { updateAt: procedure.updateAt, msg: '更新片段标记成功！' }
    } catch (error) {
      this.userlogger.error(`更新片段标记失败,项目id:${procedureId}`, error)
      throw error
    }
  }

  async removeFragment(procedureId: string, fragmentId: string, userId: string) {
    try {
      const procedure = await this.findOneBy({ _id: procedureId, userId })
      if (!procedure) throw new Error('找不到目标工程！')
      const result = procedure.fragments.some((fragment, index, arr) => {
        if (fragment._id === fragmentId) {
          arr[index].removed = RemovedEnum.ACTIVE
          arr[index].tags.flatMap(i => null)
          arr[index].promoters.flatMap(i => null)
          return true
        }
      })
      // eslint-disable-next-line prettier/prettier
      if (!result)
        throw new Error(
          `片段移除失败，未找到片段，项目id: ${procedureId}, 片段id: ${fragmentId}`
        )
      const index = procedure.sequence.findIndex(i => i === fragmentId)
      // console.log(index)
      procedure.sequence.splice(index, 1) // 不能使用 indexOf 找 string
      procedure.updateAt = new Date()
      procedure.removedSequence.push(fragmentId)
      await this.projectsRepository.put(procedure)
      return { updateAt: procedure.updateAt, msg: '移除片段成功！' }
    } catch (error) {
      this.userlogger.error(`移除片段失败,项目id:${procedureId}, 片段id:${fragmentId}`, error)
      throw error
    }
  }

  async restoreFragment(procedureId: string, fragmentId: string, userId: string) {
    try {
      const procedure = await this.findOneBy({ _id: procedureId, userId })
      if (!procedure) throw new Error('找不到目标工程！')
      const result = procedure.fragments.some((fragment, index, arr) => {
        if (fragment._id === fragmentId) {
          arr[index].removed = RemovedEnum.NEVER
          return true
        }
      })
      // eslint-disable-next-line prettier/prettier
      if (!result)
        throw new Error(
          `片段恢复失败，未找到片段，项目id: ${procedureId}, 片段id: ${fragmentId}`
        )
      const index = procedure.removedSequence.findIndex(i => i === fragmentId)
      procedure.removedSequence.splice(index, 1)
      procedure.sequence.push(fragmentId)
      procedure.updateAt = new Date()
      await this.projectsRepository.put(procedure)
      return { updateAt: procedure.updateAt, msg: '恢复片段成功！' }
    } catch (error) {
      this.userlogger.error(`恢复片段失败,项目id:${procedureId}, 片段id:${fragmentId}`, error)
      throw error
    }
  }

  async deleteFragment(procedureId: string, fragmentId: string, userId: string, dirname: string) {
    try {
      const procedure = await this.findOneById(procedureId, userId)
      let filename = ''
      const result = procedure.fragments.some((fragment, index, arr) => {
        if (fragment._id === fragmentId) {
          filename = fragment.audio
          arr.splice(index, 1)
          return true
        }
      })
      // eslint-disable-next-line prettier/prettier
      if (!result)
        throw new Error(
          `片段彻底删除失败，未找到片段，项目id: ${procedureId}, 片段id: ${fragmentId}`
        )
      // 删除移除序列中的片段
      const index = procedure.removedSequence.findIndex(i => i === fragmentId)
      procedure.removedSequence.splice(index, 1)
      // 删除片段对应的音频文件
      const filepath = this.storageService.getFilePath({
        filename,
        dirname: [dirname, procedure.dirname],
        category: 'audio'
      })
      // console.log(filepath)
      try {
        this.storageService.deleteSync(filepath)
      } catch (error) {
        console.log(error)
      }
      procedure.updateAt = new Date()
      await this.projectsRepository.put(procedure)
      return { updateAt: procedure.updateAt, msg: '彻底删除片段成功！' }
    } catch (error) {
      this.userlogger.error(`彻底删除片段失败,项目id:${procedureId}, 片段id:${fragmentId}`, error)
      throw error
    }
  }

  async addFragmentPromoter(
    procedureId: string,
    fragmentId: string,
    userId: string,
    promoterIndex: number,
    promoterSerial: string,
    promoterId: string
  ) {
    try {
      const procedure = await this.findOneById(procedureId, userId)
      const result = procedure.fragments.some((fragment, index, arr) => {
        if (fragment._id === fragmentId) {
          arr[index].promoters[promoterIndex] = promoterId
          arr[index].tags[promoterIndex] = promoterSerial
          return true
        }
      })
      // eslint-disable-next-line prettier/prettier
      if (!result)
        throw new Error(
          `添加启动子失败, 未找到目标片段，项目id:${procedureId},片段id:${fragmentId},启动子编号:${promoterId}`
        )
      procedure.updateAt = new Date()
      await this.projectsRepository.put(procedure)
      return { updateAt: procedure.updateAt, msg: '添加启动子成功！' }
    } catch (error) {
      this.userlogger.error(`添加启动子失败,项目id:${procedureId},片段id:${fragmentId},启动子编号:${promoterId}`, error)
      throw error
    }
  }

  async removeFragmentPromoter(procedureId: string, fragmentId: string, userId: string, promoterIndex: number) {
    try {
      const procedure = await this.findOneBy({ _id: procedureId, userId })
      const result = procedure.fragments.some((fragment, index, arr) => {
        if (fragment._id === fragmentId) {
          arr[index].promoters[promoterIndex] = null
          arr[index].tags[promoterIndex] = null
          return true
        }
      })
      if (!result) throw new Error(`未找到目标片段`)
      procedure.updateAt = new Date()
      await this.projectsRepository.put(procedure)
      return { updateAt: procedure.updateAt, msg: '添加启动子成功！' }
    } catch (error) {
      this.userlogger.error(`移除启动子失败,项目id:${procedureId},片段id:${fragmentId}`, error)
      throw error
    }
  }

  async updateSequence(_id: string, fragmentId: string, userId: string, oldIndex: number, newIndex: number) {
    // console.log('updateSequence', _id, fragmentId, userId, oldIndex, newIndex)
    try {
      const procedure = await this.findOneById(_id, userId)
      procedure.sequence.splice(oldIndex, 1)
      procedure.sequence.splice(newIndex, 0, fragmentId)
      procedure.updateAt = new Date()
      await this.projectsRepository.put(procedure)
      this.checkAndCorrectFragmentSquence(_id) // 校验片段序列
      return { updateAt: procedure.updateAt, msg: '移动片段成功！' }
    } catch (error) {
      this.userlogger.error(`移动片段失败,项目id:${_id},片段id:${fragmentId}`, error)
      throw error
    }
  }

  async copyFragment(args: {
    sourceProejctId: string
    targetProejctId: string
    sourceFragmentId: string
    targetFragmentId: string
    position: 'before' | 'after'
    type: 'copy' | 'cut'
    userId: string
    dirname: string
  }) {
    // eslint-disable-next-line prettier/prettier
    const { sourceFragmentId, targetFragmentId, sourceProejctId, targetProejctId, userId, dirname, position, type } =
      args
    // console.log(args)
    if (sourceProejctId === targetProejctId && sourceFragmentId === targetFragmentId && type === 'cut') {
      throw new Error('不能自己剪切自己,操作无意义')
    }
    const source = await this.findOneBy({ _id: sourceProejctId, userId })
    const target = await this.findOneBy({ _id: targetProejctId, userId })

    if (!source) throw new Error('源项目不存在')
    if (!target) throw new Error('目标项目不存在')
    const fragment = source.fragments.find(i => i._id === sourceFragmentId)
    if (!fragment) throw new Error('源片段不存在')
    // 1. 获取源文件地址
    const sourceFilepath = this.storageService.getFilePath({
      filename: fragment.audio,
      dirname: [dirname, source.dirname],
      category: 'audio'
    })
    const newFragmentId = UUID.v4()
    // 2. 创建复制文件地址
    const { filename, filepath: targetFilepath } = this.storageService.createFilePath({
      dirname: [dirname, target.dirname],
      originalname: newFragmentId,
      category: 'audio',
      extname: '.wav'
    })
    // 3. 复制文件
    try {
      this.storageService.copyFileSync(sourceFilepath, targetFilepath)
    } catch (error) {
      throw new Error('复制文件失败')
    }
    // 创建复制片段对象
    const newFragment: Fragment = {
      _id: newFragmentId, // 不复制 _id 信息
      audio: filename, // 新文件名称
      duration: fragment.duration,
      txt: fragment.txt,
      transcript: fragment.transcript,
      tags: new Array(fragment.transcript.length), // 不复制标记信息
      promoters: new Array(fragment.transcript.length), // 不复制标记信息
      timestamps: fragment.timestamps,
      role: fragment.role,
      removed: fragment.removed
    }
    // 查找目标片段位置
    // console.log(target)
    // console.log(targetFragmentId)
    const index = target.sequence.findIndex(i => i === targetFragmentId)
    // console.log(index)
    if (index === -1) throw new Error('目标片段不存在')
    if (position === 'before') {
      // 在目标片段之前插入
      target.sequence.splice(index, 0, newFragment._id)
    }
    if (position === 'after') {
      // 在目标片段之后插入
      target.sequence.splice(index + 1, 0, newFragment._id)
    }
    target.fragments.push(newFragment)
    if (type === 'cut') {
      // 剪切模式下，要将源片段移除掉
      if (sourceProejctId === targetProejctId) {
        // 如果源项目与目标项目相同，以目标项目数据为准
        target.fragments.splice(
          target.fragments.findIndex(i => i._id === fragment._id),
          1
        )
        target.sequence.splice(
          target.sequence.findIndex(i => i === fragment._id),
          1
        )
      }
      if (sourceProejctId !== targetProejctId) {
        // 如果源项目与目标项目不相同的情况，需要移除源项目片段数据
        source.fragments.splice(
          source.fragments.findIndex(i => i._id === fragment._id),
          1
        )
        source.sequence.splice(
          source.sequence.findIndex(i => i === fragment._id),
          1
        )
      }

      // 删除对应源文件
      try {
        this.storageService.deleteSync(sourceFilepath)
      } catch (error) {
        console.log('剪切模式-删除源音频文件失败:' + error)
        // 不阻断进程
      }
    }
    if (sourceProejctId === targetProejctId) {
      // 源项目与目标项目相同，只需要保存更新目标项目
      target.updateAt = new Date()
      await this.projectsRepository.put(target)
      this.checkAndCorrectFragmentSquence(target._id) // 校验片段序列
    }
    if (sourceProejctId !== targetProejctId) {
      // 源项目与目标项目不相同，需要同时保存更新源项目与目标项目
      source.updateAt = new Date()
      target.updateAt = new Date()
      await Promise.all([this.projectsRepository.put(source), this.projectsRepository.put(target)])
      this.checkAndCorrectFragmentSquence(source._id) // 校验片段序列
      this.checkAndCorrectFragmentSquence(target._id) // 校验片段序列
    }
    newFragment.audio = targetFilepath
    return { fragment: newFragment, updateAt: target.updateAt, msg: '复制片段成功！' }
  }

  // 检查并校正片段序列
  async checkAndCorrectFragmentSquence(_id: string) {
    const project = await this.findOneBy({ _id, library: LibraryEnum.PROCEDURE })
    if (!project) return console.log('校验项目不存在！')
    // 正常片段
    const fragments = project.fragments.filter(fragment => fragment.removed === RemovedEnum.NEVER)
    // 移除片段
    const removedFragments = project.fragments.filter(fragment => fragment.removed !== RemovedEnum.NEVER)
    // 正常片段是否全包含于正常序列中
    fragments.forEach(fragment => {
      const isInclude = project.sequence.some(id => fragment._id)
      if (!isInclude) {
        console.log(`${fragment._id} 片段未被包含于正常序列中`)
        // 将未记录片段 id 添加至正常序列
        project.sequence.push(fragment._id)
      }
    })
    // 移除片段是否全包含于移除序列中
    removedFragments.forEach(fragment => {
      const isInclude = project.removedSequence.some(id => fragment._id)
      if (!isInclude) {
        console.log(`${fragment._id} 片段未被包含于移除序列中`)
        // 将未记录片段 id 添加至移除序列
        project.removedSequence.push(fragment._id)
      }
    })
    // 正常序列中是否存在异常片段
    project.sequence.forEach((fragmentId, index, arr) => {
      const isInclude = fragments.some(fragment => fragment._id === fragmentId)
      if (!isInclude) {
        console.log(`正常片段中未找到 _id 为 ${fragmentId} 的片段`)
        // 移除异常片段 id
        arr.splice(index, 1)
      }
    })
    // 移除序列中是否存在异常片段
    project.removedSequence.forEach((fragmentId, index, arr) => {
      const isInclude = removedFragments.some(fragment => fragment._id === fragmentId)
      if (!isInclude) {
        console.log(`移除片段中未找到 _id 为 ${fragmentId} 的片段`)
        // 移除异常片段 id
        arr.splice(index, 1)
      }
    })
    project.updateAt = new Date()
    await this.projectsRepository.put(project)
  }
  /** -------------------------------- 片段 ------------------------------------ */

  /** 生成项目专用目录的地址 */
  async generateDirname(userDirname: string) {
    let dirname = generateRandomStr()
    let projects = await this.findBy({ dirname })
    // 校验该地址是否已经存在
    let fullPath1 = path.join(__rootdirname, 'public', userDirname, dirname)
    let fullPath2 = path.join(__rootdirname, 'private', userDirname, dirname)
    while (projects.length > 0 || fs.existsSync(fullPath1) || fs.existsSync(fullPath2)) {
      // console.log('该用户文件夹已存在，重新生成')
      dirname = generateRandomStr()
      projects = await this.findBy({ dirname })
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
