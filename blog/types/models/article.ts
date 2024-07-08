import type { ObjectId } from 'mongoose'
import type { RemovedEnum } from '~/enums'
import type { AuthCodeType, ColumnType } from '.'
import  type { PaginateResult } from 'mongoose'

export interface ArticleSchema {
  _id: ObjectId
  UID: string
  editionId: string
  fromEditionId: string
  userId: ObjectId
  authcodeId: ObjectId
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

export type ArticleType = Omit<ArticleSchema, '_id' | 'userId' | 'authcodeId' | 'columnId' | 'removed' | 'createAt' | 'updateAt'> & {
  _id: string
  userId: string
  authcodeId: string
  columnId: string
  createAt: string
  updateAt: string
}

export type ArticleFilter = Omit<ArticleSchema, '_id' | 'userId' | 'authcodeId' | 'columnId' | 'createAt' | 'updateAt'> & {
  _id: string
  userId: string
  authcodeId: string
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
  | 'authcodeId'
  | 'columnId'
  | 'isParsed'
  | 'isPublish'
  | 'title'
  | 'msg'
  | 'editorVersion'
  | 'type'
  | 'abbrev'
  | 'author'
  | 'createAt'
  | 'updateAt'
>

export type Submission = Pick<
  ArticleType,
  | '_id'
  | 'UID'
  | 'editionId'
  | 'fromEditionId'
  | 'columnId'
  | 'isParsed'
  | 'isPublish'
  | 'title'
  | 'msg'
  | 'editorVersion'
  | 'type'
  | 'abbrev'
  | 'author'
  | 'detail'
  | 'createAt'
  | 'updateAt'
> & {
  authcode: AuthCodeType
  column: ColumnType
}

export type ArticlePaginateResult = PaginateResult<Submission>

export type SubmissionState = Pick<
  ArticlePaginateResult,
  | 'docs'
  | 'totalDocs'
  | 'limit'
  | 'hasPrevPage'
  | 'hasNextPage'
  | 'page'
  | 'totalPages'
  | 'prevPage'
  | 'nextPage'
  | 'pagingCounter'
>
// _id: '',
// UID: '',
// editionId: '',
// fromEditionId: '',
// authcodeId: '',
// isParsed: false,
// isPublish: false,
// title: '',
// msg: '',
// editorVersion: '',
// type: 'other',
// abbrev: '',
// author: {
//   penname: '',
//   avatar: '',
//   email: '',
//   blog: ''
// },
// detail: {
//   wordage: 0,
//   duration: 0,
//   fileSize: 0,
// },
// createAt: '',
// updateAt: ''
