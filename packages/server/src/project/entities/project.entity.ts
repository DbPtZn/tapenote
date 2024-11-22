import { LibraryEnum, RemovedEnum } from 'src/enum'
import { Folder } from 'src/folder/entities/folder.entity'
import { Fragment } from 'src/fragment/entities/fragment.entity'
import { Snapshot } from 'src/snapshot/entities/snapshot.entity'
import { User } from 'src/user/entities/user.entity'
import {
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { uuidv7 } from 'uuidv7'

export interface Annotation {
  id: string
  content: string
  annotator: string
  updateAt: string
  createAt: string
}
export interface ProjectBGM {
  id: string
  cover: string // 封面
  name: string  // 名称
  audio: string // 地址
  volumn: number  // 音量
  duration: number  // 时长
}

/** 投稿历史 */
export interface SubmissionHistory {
  key: string
  receiver: string
  editionId: string
  address: string
  code: string
  title: string
  content?: string
  penname: string
  email: string
  blog: string
  msg: string
  date: string
}

export interface ProjectConfig {

}

export interface Memo {
  id: string
  content: string
  isExpanded: boolean
  bgColor: 'yellow' | 'green' | 'pink' | 'purple' | 'blue' | 'white' | 'gray'
  height: number
  width: number
  x: number
  y: number
  updateAt: Date
  createAt: Date
}

@Entity()
export class Project {
  @PrimaryColumn({
    type: 'varchar',
    length: 36
  })
  id: string

  @BeforeInsert()
  generateUuid() {
    if(!this.id) this.id = uuidv7()
  }

  @Column({
    type: 'varchar',
    length: 36
  })
  userId: string // 用户 id

  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User

  @Column({
    type: 'varchar',
    length: 36
  })
  folderId: string // 文件夹 id

  @ManyToOne(() => Folder, folder => folder.projects)
  @JoinColumn({ name: 'folderId', referencedColumnName: 'id' })
  folder: Folder

  @OneToMany(() => Snapshot, snapshot => snapshot.project)
  snapshots: Snapshot[]

  @Column({
    type: 'varchar',
    length: 10
  })
  lib: LibraryEnum

  @Column({
    type: 'varchar',
    length: 10,
    default: ''
  })
  editorVersion: string

  @Column({
    type: 'varchar',
    length: 36,
    default: ''
  })
  cover: string // 封面

  @Column({
    type: 'int',
    default: 50
  })
  coverPosition: number // 封面位置

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  firstPicture: string // 首图

  @Column({
    type: 'varchar',
    length: 36,
    default: ''
  })
  screenShot: string // 截图

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  title: string // 标题

  @Column({
    type: 'text'
  })
  content: string // 内容

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  abbrev: string // 内容缩略
  
  @Column({
    type: 'simple-json',
    nullable: true
  })
  memos: Memo[]
  
  @Column({
    type: 'varchar',
    length: 8,
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum

  /** ------------------------------------------ Procedure -------------------------------------------- */
  /** 文档中的所有片段 主实体删除时，{ onDelete: 'CASCADE', onUpdate: 'CASCADE' } 关联子实体也要删除 (子实体关联的文件可能需要通过 dirname 去找到并删除) */
  @OneToMany(() => Fragment, fragment => fragment.project)
  fragments: Fragment[]

  /** 文档中的正常片段的顺序 */
  @Column({
    type: 'simple-array',
    nullable: true
  })
  sequence: string[]

  /** 文档中的被移除片段的顺序 */
  @Column({
    type: 'simple-array',
    nullable: true
  })
  removedSequence: string[]

  /** ------------------------------------------ Procedure -------------------------------------------- */
  @Column({
    type: 'varchar',
    length: 36,
    nullable: true
  })
  fromNoteId: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  speakerHistory: { human: string; machine: string } // 记录项目中最近使用的 speaker 仅在 procedure 模式下使用

  @Column({
    type: 'simple-json',
    nullable: true
  })
  bgm: ProjectBGM // 背景音乐, 一般会先查询项目本地的 bgm.audio, 如果没有，则通过 bgmid 到 bgm 库查询，如果都没有，则项目没有配置 bgm

  /** ------------------------------------------  course  -------------------------------------------- */
  @Column({
    type: 'varchar',
    length: 36,
    nullable: true
  })
  fromProcedureId: string

  @Column({
    type: 'varchar',
    length: 36,
    nullable: true
  })
  snapshotId: string // 当前版本

  @Column({
    type: 'varchar',
    length: 36,
    default: ''
  })
  audio: string // 音频地址

  @Column({
    type: 'float',
    default: 0
  })
  duration: number // 音频时长 (按秒计)

  @Column({
    type: 'simple-array',
    nullable: true
  })
  promoterSequence: Array<string> // 启动子序列

  @Column({
    type: 'simple-array',
    nullable: true
  })
  keyframeSequence: Array<number> // 关键帧序列

  @Column({
    type: 'simple-array',
    nullable: true
  })
  subtitleSequence: Array<string> // 字幕序列

  @Column({
    type: 'simple-array',
    nullable: true
  })
  subtitleKeyframeSequence: Array<number> // 字幕关键帧序列

  @Column({
    type: 'simple-json',
    nullable: true
  })
  annotations: Annotation[]

  /** ------------------------------------------  course  -------------------------------------------- */

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @DeleteDateColumn()
  deleteAt: Date

  /** 详情 */
  @Column({
    type: 'simple-json',
    nullable: true
  })
  detail: {
    penname: string // 笔名
    homepage: string // 个人主页
    email: string // 邮箱
    wordage: number // 字数
    filesize: number // 文件大小(包含音频文件、文本、图片) 未使用
  }

  @Column({
    type: 'simple-json',
    nullable: true
  })
  submissionHistory: SubmissionHistory[]

  @Column({
    type: 'simple-json',
    nullable: true
  })
  config: ProjectConfig

  /** 插入实体时设置创建时间 （仅在使用 save 方法进行更新时生效） */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
    this.updateAt = new Date()
  }

  /** 实体更新时自动更新时间 （仅在使用 save 方法进行更新时生效） */
  @BeforeUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
