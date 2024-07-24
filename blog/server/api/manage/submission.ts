import { Types } from 'mongoose'
import { GetArticleDto } from '~/dto'
import { articleService } from '~/server/services'

/** 根据授权 ID 查询项目 */
export default defineEventHandler(async (event) => {
  try {
    // const param = getRouterParam(event, 'param')
    const dto = await readBody<GetArticleDto>(event)
    // console.log(param)
    // console.log(typeof isOnlyShowUnparsed)
    const data = await articleService.find(dto, event.context.auth.id)
    return data
  } catch (error) {
    console.error(error)
    throw createError({
      message: '获取稿件数据失败！'
    })
  }
})