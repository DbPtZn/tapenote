import type { ObjectId } from "mongoose"

export interface UserType {
  _id: ObjectId
  account: string
  password: string
  nickname: string
  avatar: string
  desc: string
  createAt: Date
  updateAt: Date
}
