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

  @Column()
  folderId: string // 文件夹 id

  @ManyToOne(() => Folder, folder => folder.projects)
  folder: Folder

  @Column()
  userId: string // 用户 id

  @ManyToOne(() => User, user => user.projects)
  user: User

  @Column({
    type: 'enum',
    enum: LibraryEnum
  })
  library: LibraryEnum

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
    type: 'enum',
    enum: RemovedEnum,
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum

  /** ------------------------------------------ Procedure -------------------------------------------- */
  /** 文档中的所有片段 */
  @OneToMany(() => Fragment, fragment => fragment.project)
  fragments: Fragment[]

  /** 文档中的正常片段的顺序 */
  @Column({
    default: []
  })
  sequence: string[]

  /** 文档中的被移除片段的顺序 */
  @Column({
    default: []
  })
  removedSequence: string[]

  /** ------------------------------------------ Procedure -------------------------------------------- */

  @Column()
  fromNoteId: string

  @Column({
    default: {
      name: '',
      audio: '',
      volumn: 1
    }
  })
  bgm: BGM // 背景音乐

  /** ------------------------------------------  course  -------------------------------------------- */
  @Column()
  fromProcedureId: string

  @Column()
  sidenote: string

  @Column()
  audio: string // 音频地址

  @Column()
  duration: number // 音频时长

  @Column({
    default: []
  })
  promoterSequence: Array<string> // 启动子序列

  @Column({
    default: []
  })
  keyframeSequence: Array<number> // 关键帧序列

  @Column({
    default: []
  })
  subtitleSequence: Array<string> // 字幕序列

  @Column({
    default: []
  })
  subtitleKeyframeSequence: Array<number> // 字幕关键帧序列

  @Column({
    default: []
  })
  annotations: Annotation[]

  /** ------------------------------------------  course  -------------------------------------------- */

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @Column({
    default: {
      version: 0,
      date: new Date(),
      remarks: ''
    }
  })
  snapshot: {
    version: number // 版本号
    date: Date // 版本时间
    remarks: string // 备注
  }

  @Column({
    default: false
  })
  isSnapshot: boolean // 是否属于快照（快照不可编辑，且不会显示在项目列表中）

  @Column({
    default: false
  })
  isReplica: boolean // 是否属于快照的副本（快照副本可编辑，但不会显示在项目列表中）

  /** 详情 */
  @Column({
    default: {
      penname: '',
      homepage: '',
      email: '',
      wordage: 0,
      filesize: 0
    }
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
    this.removed = RemovedEnum.NEVER
  }

  /** 实体更新时自动更新时间 （仅在使用 save 方法进行更新时生效） */
  @BeforeUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
