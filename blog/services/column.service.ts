import type { ObjectId } from 'mongoose'
import type { CreateArticleDto } from '~/dto'
import { Article } from '~/models'
import * as UUID from 'uuid'
import type { ArticleSchema, ArticleType, ColumnState, Subfile } from '~/types'
import { Column } from '~/models'
import { articleService } from '.'
class ColumnService {
  articlesRepository: typeof Article
  columnsRepository: typeof Column
  constructor() {
    this.articlesRepository = Article
    this.columnsRepository = Column
  }

}

export const columnService = new ColumnService()
