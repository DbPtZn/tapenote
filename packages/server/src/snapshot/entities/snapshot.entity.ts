import { LibraryEnum, RemovedEnum } from 'src/enum'
import { Folder } from 'src/folder/entities/folder.entity'
import { Fragment } from 'src/fragment/entities/fragment.entity'
import { Project } from 'src/project/entities/project.entity'
import { User } from 'src/user/entities/user.entity'
import {
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

export interface Annotation {
  id: string
  content: string
  annotator: string
  updateAt: string
  createAt: string
}
export interface ProjectBGM {
  id: string
  picture: string
  name: string
  audio: string
  volumn: number
  duration: number
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

@Entity()
export class Snapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  userId: string // 用户 id

  @ManyToOne(() => Project, project => project.snapshots)
  project: Project

  @Column({
    type: 'varchar',
    length: 18,
    nullable: true
  })
  editorVersion: string

  // @Column({
  //   type: 'varchar',
  //   length: 18
  // })
  // lib: LibraryEnum

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  cover: string // 封面

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

  /** ------------------------------------------ Procedure -------------------------------------------- */
  // @OneToMany(() => Fragment, fragment => fragment.project)
  // fragments: Fragment[]

  /** 文档中的正常片段的顺序 */
  // @Column({
  //   type: 'simple-array',
  //   nullable: true
  // })
  // sequence: string[]

  /** 文档中的被移除片段的顺序 */
  // @Column({
  //   type: 'simple-array',
  //   nullable: true
  // })
  // removedSequence: string[]

  /** ------------------------------------------ Procedure -------------------------------------------- */
  @Column({
    type: 'simple-json',
    nullable: true
  })
  bgm: ProjectBGM // 背景音乐, 一般会先查询项目本地的 bgm.audio, 如果没有，则通过 bgmid 到 bgm 库查询，如果都没有，则项目没有配置 bgm

  /** ------------------------------------------  course  -------------------------------------------- */
  @Column({
    type: 'text',
    nullable: true
  })
  sidenote: string

  @Column({
    type: 'varchar',
    default: ''
  })
  audio: string // 音频地址

  @Column({
    type: 'int',
    default: 0
  })
  duration: number // 音频时长

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

  /** 详情 */
  @Column({
    type: 'simple-json',
    nullable: true
  })
  detail: {
    penname: string
    homepage: string
    email: string
    wordage: number // 字数
    filesize: number // 文件大小(包含音频文件、文本、图片)
  }


  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

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
