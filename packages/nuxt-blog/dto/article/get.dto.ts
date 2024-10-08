import type { ObjectId } from "mongoose"
import type { ArticleFilter } from "~/types"

export interface GetArticleDto {
  filter: Partial<ArticleFilter> // 查询条件
  limit: number // 查询数量
  // skip: number // 跳过数量
  page: number // 当前页码
  sort?: any // 排序条件
  // projection?: any // 投影条件
  // populate?: any // 填充条件
  // lean?: boolean // 是否返回 lean 对象
}