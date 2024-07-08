import type { ObjectId } from "mongoose"

export interface UserSchema {
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
  columnSequence: string[]
  createAt: Date
  updateAt: Date
}


export type UserType = Omit<
  UserSchema,
 '_id' | 'removed' | 'encryptedPassword' | 'createAt' | 'updateAt'
> & { 
  _id: string
  createAt: string
  updateAt: string
}

export type UserState = UserType
