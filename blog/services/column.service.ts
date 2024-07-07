import type { ObjectId } from 'mongoose'
import { Article, Column  } from '~/models'
import * as UUID from 'uuid'
import type { ArticleSchema, ArticleType, ColumnState, Subfile } from '~/types'
import { articleService } from '.'
import { RemovedEnum } from '~/enums'
class ColumnService {
  articlesRepository: typeof Article
  columnsRepository: typeof Column
  constructor() {
    this.articlesRepository = Article
    this.columnsRepository = Column
  }

  async create(name: string, userId: string) {
    try {
      const column = await this.columnsRepository.create({
        name,
        userId,
      })
      return column
    } catch (error) {
      throw error
    }
  }

  async getColumns(userId: string) {
    try {
      const columns = await this.columnsRepository.find({ userId, removed: RemovedEnum.NEVER })
      return columns
    } catch (error) {
      throw error
    }
  }

  async getColumn(columnId: string, userId: string) {
    try {
      const articles = await this.articlesRepository.find(
        { columnId, userId, removed: RemovedEnum.NEVER },
        { _id: 1, columnId: 1, editionId:1, type:1, title: 1, abbrev: 1, cover:1, isParsed: 1, isPublish: 1, author:1, detail: 1  }
      )
      const column = await this.columnsRepository.findById(columnId)
      if (!column) {
        throw new Error('专栏不存在')
      }
      const data = {
        _id: column._id,
        name: column.name,
        subfiles: articles.map((article) => {
          return {
            _id: article._id,
            columnId: article.columnId,
            editionId: article.editionId,
            type: article.type,
            title: article.title,
            abbrev: article.abbrev,
            cover: article.cover,
            isParsed: article.isParsed,
            isPublish: article.isPublish,
            author: article.author,
            detail: article.detail
          }
        })
      }
      return data
    } catch (error) {
      throw error
    }
  }

  update() {
    // 更新名称、封面、发布状态
  }

  remove() {
    // 移除
  }

}

export const columnService = new ColumnService()
