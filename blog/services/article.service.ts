import type { ObjectId } from 'mongoose'
import type { CreateArticleDto, GetArticleDto, ParseArticleDto } from '~/dto'
import { Article } from '~/models'
import * as UUID from 'uuid'
import fs from 'fs'
import mongoosePaginate from 'mongoose-paginate'
import type { ArticleSchema, ArticleType } from '~/types'

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
    const { isParsed, editorVersion, authcodeId, penname, email, blog, msg, type, title, content, audio } = dto
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
        content,
        audio,
        author: {
          penname,
          email,
          blog
        },
        userId
      })
    } catch (error) {}
  }

  async parse(dto: ParseArticleDto, userId: ObjectId) {
    try {
      const { _id, cover, content, duration, promoterSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence } = dto
      const result = await this.articlesRepository.updateOne(
        { _id },
        {
          $set: {
            isParsed: true,
            cover,
            content,
            abbrev: content.replace(/<[^>]+>/g, '').slice(0, 100),
            duration,
            promoterSequence,
            keyframeSequence,
            subtitleSequence,
            subtitleKeyframeSequence
          }
        }
      )
      console.log(result)
      return result.acknowledged
    } catch (error) {
      throw error
    }
  }

  async find(dto: GetArticleDto, userId: ObjectId) {
    const { filter, limit, skip, sort } = dto
    const articles = await this.articlesRepository.find(
      { ...filter, userId },
      {
        _id: 1,
        UID: 1,
        editionId: 1,
        fromEditionId: 1,
        authcodeId: 1,
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
      {
        populate: ['authcodeId'],
        limit: limit,
        skip: skip,
        sort: sort
      }
    )
    const data = articles.map(artilce => {
      const { authcodeId, ...members } = artilce.toJSON()
      return {
        ...members,
        authcode: artilce.authcodeId
      }
    })
    return data
  }

  async findAllUnParsed(userId: ObjectId) {
    try {
      const articles = await this.articlesRepository.find(
        { isParsed: false, userId },
        {
          _id: 1,
          UID: 1,
          editionId: 1,
          fromEditionId: 1,
          authcodeId: 1,
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
        {
          populate: ['authcodeId']
        }
      )
      const data = articles.map(artilce => {
        const { authcodeId, ...members } = artilce.toJSON()
        return {
          ...members,
          authcode: artilce.authcodeId
        }
      })
      return data
    } catch (error) {
      throw error
    }
  }

  async findAllSubmission(userId: ObjectId) {
    try {
      const articles = await this.articlesRepository.find(
        { userId },
        {
          _id: 1,
          UID: 1,
          editionId: 1,
          fromEditionId: 1,
          authorizeId: 1,
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
        {
          populate: ['authorizeId']
        }
      )

      const data = articles.map(artilce => {
        const { authcodeId, ...members } = artilce.toJSON()
        return {
          ...members,
          authcode: artilce.authcodeId
        }
      })
      return data
    } catch (error) {
      throw error
    }
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
