import { MaxLength, MinLength } from 'class-validator'
import { Bgm } from 'src/bgm/entities/bgm.entity'
import { Folder } from 'src/folder/entities/folder.entity'
import { Project } from 'src/project/entities/project.entity'
import { Timbre } from 'src/timbre/entities/timbre.entity'
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
export type Sex = 'male' | 'female' | 'other' | 'secrecy'

export class Dir {
  @Column({
    type: 'uuid'
  })
  note: string

  @Column({
    type: 'uuid'
  })
  course: string

  @Column({
    type: 'uuid'
  })
  procedure: string
}

export class SubscriptionConfig {
  @Column({
    type: 'uuid'
  })
  id: string

  @Column('varchar', { length: 50 })
  name: string

  @Column({
    type: 'varchar',
    default: ''
  })
  site: string

  @Column({
    type: 'varchar',
    default: ''
  })
  code: string

  @Column({
    type: 'varchar',
    default: ''
  })
  desc: string
}

export class SubmissionConfig {
  @Column({
    type: 'uuid'
  })
  id: string

  @Column({
    type: 'varchar',
    length: 50
  })
  name: string

  @Column({
    type: 'varchar',
    default: ''
  })
  site: string

  @Column({
    type: 'varchar',
    default: ''
  })
  code: string

  @Column({
    type: 'varchar',
    default: ''
  })
  desc: string
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToMany(() => Project, project => project.user)
  projects: Project

  @OneToMany(() => Folder, folder => folder.user)
  folders: Folder

  @OneToOne(() => Timbre, timbre => timbre.user)
  timbre: Timbre

  @OneToOne(() => Bgm, bgm => bgm.user)
  bgm: Bgm

  @Column({
    type: 'varchar',
    unique: true
  })
  account: string // 账号

  @Column({
    type: 'varchar',
    length: 64
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
    length: 255,
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
    type: 'int',
    default: 0
  })
  age: number // 年龄

  @Column({
    type: 'varchar',
    default: 'secrecy'
  })
  sex: Sex // 性别

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  desc: string // 描述

  @Column({
    type: 'simple-json',
    default: JSON.stringify({
      note: '',
      course: '',
      procedure: ''
    })
  })
  dir: Dir

  @Column({
    type: 'varchar',
    length: 18,
    nullable: false
  })
  dirname: string

  @Column({
    type: 'simple-json',
    default: JSON.stringify([])
  })
  submissionConfig: SubmissionConfig[]

  @Column({
    type: 'simple-json',
    default: JSON.stringify([])
  })
  subscriptionConfig: SubscriptionConfig[]

  @CreateDateColumn()
  createAt: Date // 创建时间

  @UpdateDateColumn()
  updateAt: Date // 更新时间

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
