import { MaxLength, MinLength } from 'class-validator'
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
export enum Sex {
  WOMAN = 0, // 女性
  MAN = 1, // 男性
  LGBT = 2, // 跨性别
  PRIVATE = 3 // 不公开
}

export class Dir {
  @Column()
  note: string

  @Column()
  course: string

  @Column()
  procedure: string
}

export class SubscriptionConfig {
  @Column()
  id: string

  @Column()
  @MaxLength(36)
  name: string

  @Column({
    default: ''
  })
  site: string

  @Column({
    default: ''
  })
  code: string

  @Column({
    default: ''
  })
  desc: string
}

export class SubmissionConfig {
  @Column()
  id: string

  @Column()
  @MaxLength(36)
  name: string

  @Column({
    default: ''
  })
  site: string

  @Column({
    default: ''
  })
  code: string

  @Column({
    default: ''
  })
  desc: string
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true
  })
  account: string // 账号

  @Column()
  @MaxLength(120)
  encryptedPassword: string // 密码

  @Column({
    length: 18,
    default: '未命名用户'
  })
  nickname: string // 昵称

  @Column()
  avatar: string //头像

  @Column({
    default: ''
  })
  email: string // 邮箱

  @Column({
    default: ''
  })
  phone: string // 手机

  @Column({
    default: ''
  })
  homepage: string // 个人主页

  @Column({
    default: 0
  })
  age: number // 年龄

  @Column({
    type: 'enum',
    enum: Sex,
    default: Sex.PRIVATE
  })
  sex: Sex // 性别

  @Column({
    default: ''
  })
  @MaxLength(64)
  desc: string // 描述

  @Column(type => Dir)
  dir: Dir

  @Column()
  dirname: string

  @Column({
    type: 'string',
    default: JSON.stringify([]),
    transformer: { to: value => JSON.stringify(value), from: value => JSON.parse(value) }
  })
  submissionConfig: SubmissionConfig[]

  @Column({
    default: []
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
