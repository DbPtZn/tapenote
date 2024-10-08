import type { ObjectId } from "mongoose"

export interface AuthCodeSchema {
  _id: ObjectId
  userId: ObjectId
  name: string
  code: string
  desc: string
  disabled: boolean
  createAt: Date
  updateAt: Date
}

export type AuthCodeType = Omit<
AuthCodeSchema,
 '_id'| 'userId' | 'createAt' | 'updateAt'
> & { 
  _id: string
  createAt: string
  updateAt: string
}