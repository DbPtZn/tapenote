import { MaxLength, MinLength } from 'class-validator'
export enum Sex {
  WOMAN = 0, // 女性
  MAN = 1, // 男性
  LGBT = 2, // 跨性别
  PRIVATE = 3 // 不公开
}

export class Dir {
  note: string

  course: string

  procedure: string
}

export class SubscriptionConfig {
  id: string

  @MaxLength(36)
  name: string

  site: string

  code: string

  desc: string
}

export class SubmissionConfig {
  id: string

  @MaxLength(36)
  name: string

  site: string

  code: string

  desc: string
}

export class User {
  _id: string

  account: string // 账号

  @MaxLength(120)
  encryptedPassword: string // 密码

  nickname: string // 昵称

  avatar: string //头像

  email: string // 邮箱

  phone: string // 手机

  homepage: string // 个人主页

  age: number // 年龄

  sex: number // 性别

  @MaxLength(64)
  desc: string // 描述

  dir: Dir

  dirname: string

  submissionConfig: SubmissionConfig[]

  subscriptionConfig: SubscriptionConfig[]

  createAt: Date // 创建时间

  updateAt: Date // 更新时间

  // /** 插入实体时设置创建时间 */
  // createDate() {
  //   this.createAt = new Date()
  // }

  // /** 实体更新时自动更新时间 */
  // updateDate() {
  //   this.updateAt = new Date()
  // }
}
