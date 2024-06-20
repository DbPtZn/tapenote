import type { ObjectId } from 'mongoose'
import { Article } from '~/models'

class ArticleService {
  articlesRepository: typeof Article
  constructor() {
    this.articlesRepository = Article
  }

  create() {
    
  }

  async get(UID: string) {
    try {
      const article = await this.articlesRepository
        .findOne({ UID: UID })
        .select([
          '_id', 
          'columnId', 
          'cover', 
          'title', 
          'content', 
          'abbrev', 
          'tags', 
          'createdAt', 
          'updatedAt'
        ])
      console.log(article)
      return article
    } catch (error) {
      throw error
    }
  }
}

export const articleService = new ArticleService()
