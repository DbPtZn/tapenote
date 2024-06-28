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

  async findUnparsed(userId: ObjectId) {
    try {
      const unparsedArticles = await articleService.findAllUnParsed(userId)
      const subfiles: Subfile[] = unparsedArticles.map(article => {
        return {
          _id: article._id.toString(),
          UID: article.UID,
          editionId: article.editionId,
          fromEditionId: article.fromEditionId,
          authorizeId: article.authorizeId.toString(),
          isParsed: article.isParsed,
          title: article.title,
          msg: article.msg,
          editorVersion: article.editorVersion,
          type: article.type,
          abbrev: article.abbrev,
          author: article.author,
          createAt: article.createAt.toString(),
          updateAt: article.updateAt.toString()
        }
      })
      const column: ColumnState = {
        _id: 'unparsed',
        userId: '',
        UID: '',
        account: '',
        name: '未解析',
        isPublish: false,
        subfiles: subfiles,
        createAt: '',
        updateAt: ''
      }
      return column
    } catch (error) {
      throw error
    }
  }

}

export const columnService = new ColumnService()
