import type { ObjectId } from "mongoose"

export interface UserType {
  _id: ObjectId
  UID: string
  account: string
  encryptedPassword: string
  nickname: string
  avatar: string
  desc: string
  info: {
    email: string,
    phone: string
  }
  receiverConfig: {
    status: 0 | 1 | 2
    autoParse: boolean
    sizeLimit: number
  }
  createAt: Date
  updateAt: Date
}
