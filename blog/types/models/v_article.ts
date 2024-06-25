import type { ObjectId } from 'mongoose'
import type { RemovedEnum } from '~/enums'

export interface VArticleSchema {
  _id: ObjectId
  primaryId: ObjectId
  UID: string
  userId: ObjectId
  authorizeId: ObjectId
  columnId: ObjectId
  type: 'note' | 'course' | unknown
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
  }
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

export type VArticleCard = Omit<
  VArticleSchema,
  'content' | 'promoterSequence' | 'keyframeSequence' | 'subtitleSequence' | 'subtitleKeyframeSequence' | 'removed' | 'author' | 'detail' | 'meta'
>

export type VArticleType = Omit<
  VArticleSchema,
 '_id'| 'userId' |'authorizeId' | 'columnId' | 'removed' | 'createAt' | 'updateAt'
> & { 
  _id: string
  userId: string
  authorizeId: string
  columnId: string,
  createAt: string
  updateAt: string
}
