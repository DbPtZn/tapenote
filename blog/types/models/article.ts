import type { ObjectId } from 'mongoose'
import type { RemovedEnum } from '~/enums'

export interface ArticleType {
  _id: ObjectId
  UID: string
  userId: ObjectId
  authorizeId: ObjectId
  columnId: ObjectId
  isParsed: boolean
  editorVersion: string
  cover: string
  title: string
  content: string
  abbrev: string
  audio: string
  promoterSequence: string[]
  keyframeSequence: string[]
  subtitleSequence: string[]
  subtitleKeyframeSequence: string[]
  tags: string[]
  isPublish: boolean
  removed: RemovedEnum
  author: {
    penname: string
    avatar: string 
    email: string
    website: string
  },
  detail: {
    wordage: number
    duration: number
    fileSize: number
  }
  meta: {
    views: number
    likes: number
    collections: number
    comments: number
  }
  createAt: Date
  updateAt: Date
}
