import { Types } from 'mongoose'
import { articleService } from '~/server/services'

/** 根据授权 ID 查询项目 */
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if(!id) throw new Error('未提供有效 id 参数')
    const file = await articleService.getUnparsedFile(id)
    return file
  } catch (error) {
    console.error(error)
    throw createError({
      message: '获取未解析文档数据失败！'
    })
  }
})