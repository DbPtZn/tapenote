import type { ObjectId } from "mongoose"

export interface UploadFileSchema {
  _id: ObjectId
  userId: ObjectId
  type: 'image' | 'audio'
  name: string
  extname: string
  size: number
  md5: string
  path: string
  createdAt: Date
  updatedAt: Date
}
