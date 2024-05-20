import { LibraryEnum, RemovedEnum } from 'src/enum'
import { Folder } from 'src/folder/entities/folder.entity'
import { Fragment } from 'src/fragment/entities/fragment.entity'
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
  updateAt: Date
  createAt: Date
}
export interface BGM {
  name: string
  audio: string
  volumn: number
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  userId: string // 用户 id

  @ManyToOne(() => User, user => user.projects)
  user: User

  @Column('uuid')
  folderId: string // 文件夹 id

  @ManyToOne(() => Folder, folder => folder.projects)
  folder: Folder

  @Column({
    type: 'varchar'
  })
  lib: LibraryEnum

  @Column({
    type: 'int',
    default: 0
  })
  eidtorVersion: string

  @Column({
    type: 'varchar',
    length: 18
  })
  dirname: string // 文件夹路径

  @Column({
    type: 'text',
    length: 255,
    default: '未命名文档'
  })
  title: string // 标题

  @Column({
    type: 'text',
    default: ''
  })
  content: string // 内容

  @Column({
    type: 'text',
    length: 32
  })
  abbrev: string // 内容缩略

  @Column({
    type: 'varchar',
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
    default: JSON.stringify([])
  })
  sequence: string[]

  /** 文档中的被移除片段的顺序 */
  @Column({
    type: 'simple-array',
    default: JSON.stringify([])
  })
  removedSequence: string[]

  /** ------------------------------------------ Procedure -------------------------------------------- */
  @Column({
    type: 'uuid',
    nullable: true
  })
  fromNoteId: string

  @Column({
    type: 'simple-array',
    default: JSON.stringify([])
  })
  speakerRecorder: string[] // 记录项目中使用的 speaker 仅在 procedure 模式下使用

  @Column({
    type: 'simple-json',
    default: JSON.stringify({
      human: '',
      machine: ''
    })
  })
  speakerHistory: { human: string; machine: string } // 记录项目中最近使用的 speaker 仅在 procedure 模式下使用

  @Column({
    type: 'simple-json',
    default: JSON.stringify({
      name: '',
      audio: '',
      volumn: 1
    })
  })
  bgm: BGM // 背景音乐

  /** ------------------------------------------  course  -------------------------------------------- */
  @Column({
    type: 'uuid',
    nullable: true
  })
  fromProcedureId: string

  @Column({
    type: 'text',
    default: ''
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
    default: JSON.stringify([])
  })
  promoterSequence: Array<string> // 启动子序列

  @Column({
    type: 'simple-array',
    default: JSON.stringify([])
  })
  keyframeSequence: Array<number> // 关键帧序列

  @Column({
    type: 'simple-array',
    default: JSON.stringify([])
  })
  subtitleSequence: Array<string> // 字幕序列

  @Column({
    type: 'simple-array',
    default: JSON.stringify([])
  })
  subtitleKeyframeSequence: Array<number> // 字幕关键帧序列

  @Column({
    type: 'simple-json',
    default: JSON.stringify([])
  })
  annotations: Annotation[]

  /** ------------------------------------------  course  -------------------------------------------- */

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @Column({
    type: 'simple-json',
    default: JSON.stringify({
      version: 0,
      date: new Date(),
      remarks: ''
    })
  })
  snapshot: {
    version: number // 版本号
    date: Date // 版本时间
    remarks: string // 备注
  }

  @Column({
    type: 'boolean',
    default: false
  })
  isSnapshot: boolean // 是否属于快照（快照不可编辑，且不会显示在项目列表中）

  @Column({
    type: 'boolean',
    default: false
  })
  isReplica: boolean // 是否属于快照的副本（快照副本可编辑，但不会显示在项目列表中）

  /** 详情 */
  @Column({
    type: 'simple-json',
    default: JSON.stringify({
      penname: '',
      homepage: '',
      email: '',
      wordage: 0,
      filesize: 0
    })
  })
  detail: {
    penname: string
    homepage: string
    email: string
    wordage: number // 字数
    filesize: number // 文件大小(包含音频文件、文本、图片)
  }

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
