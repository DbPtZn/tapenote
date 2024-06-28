import type { ObjectId } from 'mongoose'
import type { CreateArticleDto } from '~/dto'
import { Article } from '~/models'
import * as UUID from 'uuid'
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
    const { isParsed, editorVersion, authorizeId, penname, email, blog, msg, type, title, content, audio } = dto
    try {
      return this.articlesRepository.create({
        isParsed,
        editionId: !fromEditionId ? UUID.v4() : null,
        fromEditionId: fromEditionId ? fromEditionId : null,
        editorVersion,
        authorizeId,
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

  findAllUnParsed(userId: ObjectId) {
    return this.articlesRepository.find(
      { isParsed: false, userId },
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
      }
    )
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
