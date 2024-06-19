import type { ObjectId } from 'mongoose'
import type { RemovedEnum } from '~/enums'

export interface ArticleType {
  _id: ObjectId
  userId: ObjectId
  title: string
  content: string
  removed: RemovedEnum
  createAt: Date
  updateAt: Date
}
