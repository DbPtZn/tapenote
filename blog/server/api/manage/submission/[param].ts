import { Types } from 'mongoose'
import { articleService } from '~/services'

/** 根据授权 ID 查询项目 */
export default defineEventHandler(async (event) => {
  try {
    const param = getRouterParam(event, 'param')
    const { isOnlyShowUnparsed } = await readBody(event)
    // console.log(param)
    // console.log(typeof isOnlyShowUnparsed)
    if(param === 'all') {
      console.log('all')
      if(isOnlyShowUnparsed) {
        const data = await articleService.findAllUnParsed(event.context.auth.id)
        // console.log(data)
        return data
      } else {
        const data = await articleService.findAllSubmission(event.context.auth.id)
        return data
      }
    }
    return []
  } catch (error) {
    console.error(error)
    throw createError({
      message: '获取稿件数据失败！'
    })
  }
})