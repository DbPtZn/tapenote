import type { ObjectId } from 'mongoose'
import type { CreateArticleDto, GetArticleDto, ParseArticleDto } from '~/dto'
import { Article } from '~/models'
import * as UUID from 'uuid'
import fs from 'fs'
import path from 'path'
import  type { PaginateResult } from 'mongoose'
import type { ArticleSchema, ArticleType } from '~/types'
import { fileService } from './file.service'

class ArticleService {
  articlesRepository: typeof Article
  constructor() {
    this.articlesRepository = Article
  }

  /** 查询文章版本是否存在 */
  queryEditionExists(editionId: string) {
    return this.articlesRepository.exists({ editionId })
  }

  create(dto: CreateArticleDto, userId: ObjectId, fromEditionId: string) {
    const { isParsed, editorVersion, authcodeId, penname, email, blog, msg, type, title, abbrev, content, audio } = dto
    try {
      return this.articlesRepository.create({
        isParsed,
        editionId: !fromEditionId ? UUID.v4() : null,
        fromEditionId: fromEditionId ? fromEditionId : null,
        editorVersion,
        authcodeId,
        msg,
        type,
        title,
        abbrev,
        content,
        audio,
        author: {
          penname,
          email,
          blog
        },
        createAt: new Date(),
        updateAt: new Date(),
        userId
      })
    } catch (error) {}
  }

  async parse(dto: ParseArticleDto, userId: ObjectId, UID: string) {
    try {
      const { _id, cover, content, duration, promoterSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence } = dto
      const article = await this.articlesRepository.findById(_id)
      if (!article) {
        throw new Error('文章不存在！')
      }
      let filepath = ''
      if(article.type === 'course' && article.audio) {
        filepath = await fileService.saveAudio({
          sourcePath: article.audio,
          extname: path.extname(article.audio),
          dirname: UID
        }, userId)
        console.log(filepath)
      }
      const result = await this.articlesRepository.updateOne(
        { _id },
        {
          $set: {
            isParsed: true,
            cover,
            content,
            audio: filepath,
            abbrev: content.replace(/<[^>]+>/g, '').slice(0, 100),
            'detail.duration': duration,
            'detail.wordage': content.replace(/<[^>]+>/g, '').length,
            promoterSequence,
            keyframeSequence,
            subtitleSequence,
            subtitleKeyframeSequence
          }
        }
      )
      // console.log(result)
      return result.acknowledged
    } catch (error) {
      throw error
    }
  }

  findOne(_id: string, userId: ObjectId) {
    return this.articlesRepository.findOne({ _id, userId })
  }

  async find(dto: GetArticleDto, userId: ObjectId) {
    const { filter, limit, page, sort } = dto
    // console.log(filter)
    const result = await this.articlesRepository.paginate({ ...filter, userId }, {
      projection: {
        _id: 1,
        UID: 1,
        editionId: 1,
        fromEditionId: 1,
        authcodeId: 1,
        columnId: 1,
        isParsed: 1,
        title: 1,
        msg: 1,
        editorVersion: 1,
        type: 1,
        abbrev: 1,
        author: 1,
        createAt: 1,
        updateAt: 1
      },
      populate: ['authcodeId', 'columnId'],
      limit: limit || 10,
      page: page || 1,
      sort
    })
    result.docs = result.docs.map(artilce => {
      const { authcodeId, columnId, ...members } = artilce.toJSON()
      // console.log(columnId)
      return {
        ...members,
        authcode: artilce.authcodeId,
        authcodeId: authcodeId['_id'],
        column: columnId || null,
        columnId: columnId?.['_id'] || null
      }
    }) as any[]
    // console.log(result.docs)
    return result
  }



  async getUnparsedFile(_id: string) {
    try {
      const article = await this.articlesRepository.findById(_id)
      if (article && !article.isParsed) {
        const filepath = article.content
        if (fs.existsSync(filepath)) {
          const file = fs.readFileSync(filepath)
          return file
        } else {
          throw new Error('目标文件不存在！')
        }
      } else {
        throw new Error('目标项目不存在！')
      }
    } catch (error) {
      throw error
    }
  }


  async allot(_id: string, columnId: string, userId: ObjectId) {
    try {
      const result = await this.articlesRepository.updateOne({ _id, userId }, { $set: { columnId } })
      return result.acknowledged
    } catch (error) {
      throw error
    }
  }


  async get(UID: string) {
    try {
      const article = await this.articlesRepository
        .findOne({ UID: UID })
        .select(['_id', 'columnId', 'cover', 'title', 'content', 'abbrev', 'tags', 'createdAt', 'updatedAt'])
      console.log(article)
      return article
    } catch (error) {
      throw error
    }
  }
}

export const articleService = new ArticleService()
