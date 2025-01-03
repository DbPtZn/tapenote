import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Snapshot } from './entities/snapshot.entity'
import { Project } from 'src/project/entities/project.entity'
import { DataSource, Repository } from 'typeorm'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { StorageService } from 'src/storage/storage.service'
import { LibraryEnum } from 'src/enum'

@Injectable()
export class SnapshotService {
  constructor(
    @InjectRepository(Snapshot)
    private snapshotsRepository: Repository<Snapshot>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private readonly storageService: StorageService,
    private readonly userlogger: UserLoggerService,
    private readonly dataSource: DataSource
  ) {}

  /** 创建快照 */
  async create(projectId: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOne({
        where: { id: projectId, userId }
      })

      const snapshot = new Snapshot()
      snapshot.userId = project.userId
      snapshot.project = project
      snapshot.editorVersion = project.editorVersion
      snapshot.cover = project.cover
      snapshot.coverPosition = project.coverPosition
      snapshot.screenShot = project.screenShot
      snapshot.firstPicture = project.firstPicture
      snapshot.title = project.title
      snapshot.content = project.content
      snapshot.abbrev = project.abbrev
      snapshot.memos = project.memos
      snapshot.bgm = project.bgm
      snapshot.audio = project.audio
      snapshot.promoterSequence = project.promoterSequence
      snapshot.keyframeSequence = project.keyframeSequence
      snapshot.subtitleSequence = project.subtitleSequence
      snapshot.subtitleKeyframeSequence = project.subtitleKeyframeSequence
      snapshot.annotations = project.annotations
      snapshot.detail = project.detail

      const result = await this.snapshotsRepository.save(snapshot)
      this.userlogger.log(`项目${project.id}创建快照成功`)
      return {
        id: result.id,
        cover: result.cover,
        title: result.title,
        abbrev: result.abbrev,
        duration: result.duration,
        detail: result.detail,
        createAt: result.createAt
      }
    } catch (error) {
      this.userlogger.error(`项目${projectId}创建快照失败`, error.message)
      throw error
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const snapshot = await this.snapshotsRepository.findOne({
        where: { id, userId }
      })
      return snapshot
    } catch (error) {
      throw error
    }
  }

  async findAll(projectId: string, userId: string) {
    try {
      const snapshots = await this.snapshotsRepository.find({
        where: { project: { id: projectId }, userId },
        select: ['id', 'cover', 'title', 'abbrev', 'duration', 'detail', 'createAt'],
        order: { createAt: 'DESC' }
      })
      return snapshots
    } catch (error) {
      throw error
    }
  }

  async apply(projectId: string, snapshotId: string, userId: string) {
    try {
      const project = await this.projectsRepository.findOne({
        where: { id: projectId, userId }
      })
      const snapshot = await this.snapshotsRepository.findOne({
        where: { id: snapshotId, userId },
        relations: ['project']
      })
      if (snapshot.project.id !== projectId) {
        throw new Error('快照 id 与项目 id 不匹配')
      }

      project.cover = snapshot.cover
      project.coverPosition = snapshot.coverPosition
      project.screenShot = snapshot.screenShot
      project.firstPicture = snapshot.firstPicture
      project.title = snapshot.title
      project.content = snapshot.content
      project.abbrev = snapshot.abbrev
      project.bgm = snapshot.bgm
      project.memos = snapshot.memos
      project.audio = snapshot.audio
      project.promoterSequence = snapshot.promoterSequence
      project.keyframeSequence = snapshot.keyframeSequence
      project.subtitleSequence = snapshot.subtitleSequence
      project.subtitleKeyframeSequence = snapshot.subtitleKeyframeSequence
      project.annotations = snapshot.annotations
      project.detail = snapshot.detail

      const result = await this.projectsRepository.save(project)

      return result.id
    } catch (error) {
      throw error
    }
  }

  async delete(id: string, userId: string) {
    try {
      const snapshot = await this.snapshotsRepository.delete({ id, userId })
      if (snapshot.affected === 0) {
        throw new Error('删除快照失败，目标快照不存在')
      }
      return true
    } catch (error) {
      throw error
    }
  }
}
