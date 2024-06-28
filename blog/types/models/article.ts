import type { ObjectId } from 'mongoose'
import type { RemovedEnum } from '~/enums'

export interface ArticleSchema {
  _id: ObjectId
  UID: string
  editionId: string
  fromEditionId: string
  userId: ObjectId
  authorizeId: ObjectId
  columnId: ObjectId
  type: 'note' | 'course' | 'other'
  isParsed: boolean
  msg: string
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
    penname?: string
    avatar?: string
    email?: string
    blog?: string
  }
  detail: {
    wordage?: number
    duration?: number
    fileSize?: number
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

export type ArticleCard = Omit<
  ArticleSchema,
  'content' | 'promoterSequence' | 'keyframeSequence' | 'subtitleSequence' | 'subtitleKeyframeSequence' | 'removed' | 'author' | 'detail' | 'meta'
>

export type ArticleType = Omit<ArticleSchema, '_id' | 'userId' | 'authorizeId' | 'columnId' | 'removed' | 'createAt' | 'updateAt'> & {
  _id: string
  userId: string
  authorizeId: string
  columnId: string
  createAt: string
  updateAt: string
}

export type Subfile = Pick<
  ArticleType,
  | '_id'
  | 'UID'
  | 'editionId'
  | 'fromEditionId'
  | 'authorizeId'
  | 'isParsed'
  | 'title'
  | 'msg'
  | 'editorVersion'
  | 'type'
  | 'abbrev'
  | 'author'
  | 'createAt'
  | 'updateAt'
>

export type UnParsedArticle = Pick<
  ArticleType,
  | '_id'
  | 'UID'
  | 'editionId'
  | 'fromEditionId'
  | 'authorizeId'
  | 'isParsed'
  | 'title'
  | 'msg'
  | 'editorVersion'
  | 'type'
  | 'abbrev'
  | 'author'
  | 'createAt'
  | 'updateAt'
>
