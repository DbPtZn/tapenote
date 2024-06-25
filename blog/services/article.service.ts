import type { ObjectId } from 'mongoose'
import type { CreateArticleDto } from '~/dto'
import { Article } from '~/models'

class ArticleService {
  articlesRepository: typeof Article
  constructor() {
    this.articlesRepository = Article
  }

  create(data: CreateArticleDto, userId: ObjectId) {
    const { isParsed, editorVersion, authorizeId, penname, email, blog, msg, type, title, content, audio } = data
    try {
      return this.articlesRepository.create({
        isParsed,
        userId,
        editorVersion,
        authorizeId,
        penname,
        email,
        blog,
        msg,
        type,
        title,
        content,
        audio,
      })
    } catch (error) {}
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
