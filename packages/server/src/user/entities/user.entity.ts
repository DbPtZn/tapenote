import { MaxLength, MinLength } from 'class-validator'
import { Bgm } from 'src/bgm/entities/bgm.entity'
import { Folder } from 'src/folder/entities/folder.entity'
import { Project } from 'src/project/entities/project.entity'
import { Speaker } from 'src/speaker/entities/speaker.entity'
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { uuidv7 } from 'uuidv7'

export type Sex = 'male' | 'female' | 'other' | 'secrecy'
export interface Countor {
  date: Date // 统计日期
  noteCount: number
  procedureCount: number
  courseCount: number
  wordCount: number
  storageCount: number
}

export class Dir {
  note: string
  course: string
  procedure: string
}

export class SubscriptionConfig {
  id: string
  name: string
  site: string
  code: string
  desc: string
}

export class SubmissionConfig {
  id: string
  name: string
  site: string
  code: string
  desc: string
}

export class UserConfig {
  autosave?: boolean // 是否自动保存
  saveInterval?: number // 自动保存间隔毫秒
}

@Entity()
export class User {
  @PrimaryColumn({
    type: 'varchar',
    length: 36
  })
  id: string

  @BeforeInsert()
  generateUuid() {
    if(!this.id) this.id = uuidv7()
  }

  @OneToMany(() => Project, project => project.user)
  projects: Project[]

  @OneToMany(() => Folder, folder => folder.user)
  folders: Folder[]

  @OneToMany(() => Speaker, speaker => speaker.user)
  speakers: Speaker[]

  @OneToMany(() => Bgm, bgm => bgm.user)
  bgms: Bgm[]

  @Column({
    type: 'varchar',
    unique: true,
  })
  account: string // 账号

  @Column({
    type: 'varchar',
    length: 64,
    select: false
  })
  encryptedPassword: string // 密码

  @Column({
    type: 'varchar',
    length: 32,
    default: '未命名用户'
  })
  nickname: string // 昵称

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  avatar: string //头像

  @Column({
    type: 'varchar',
    length: 32,
    default: ''
  })
  email: string // 邮箱

  @Column({
    type: 'varchar',
    length: 32,
    default: ''
  })
  phone: string // 手机

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  homepage: string // 个人主页

  @Column({
    type: 'tinyint',
    default: 0
  })
  age: number // 年龄

  // 性别 0: 保密 1: 男 2: 女 3: 其他
  @Column({
    type: 'tinyint',
    default: 0
  })
  sex: number // 性别

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  desc: string // 描述

  // 项目根目录
  @Column({
    type: 'simple-json'
  })
  dir: Dir

  // 用户对象存储目录名
  @Column({
    type: 'varchar',
    length: 18,
  })
  dirname: string
  
  // 统计数据
  @Column({
    type: 'simple-json',
    nullable: true
  })
  countor: Countor
  
  // 用户配置
  @Column({
    type: 'simple-json'
  })
  config: UserConfig

  // 投稿配置
  @Column({
    type: 'simple-json'
  })
  submissionConfig: SubmissionConfig[]

  // 订阅配置
  @Column({
    type: 'simple-json'
  })
  subscriptionConfig: SubscriptionConfig[]

  @CreateDateColumn()
  createAt: Date // 创建时间

  @UpdateDateColumn()
  updateAt: Date // 更新时间

  @DeleteDateColumn()
  deleteAt: Date

  /** 插入实体时设置创建时间 */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
