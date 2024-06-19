import type { ObjectId } from 'mongoose'
import { Article } from '~/models'

class ArticleService {
  articlesRepository: typeof Article
  constructor() {
    this.articlesRepository = Article
  }

  async get(id: ObjectId) {
    try {
      const article = await this.articlesRepository.findById(id)
      return article
    } catch (error) {
      throw error
    }
  }
}

export const articleService = new ArticleService()