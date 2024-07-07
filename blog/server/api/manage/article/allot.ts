import { AllotArticleDto } from '~/dto'
import { articleService } from '~/services'

export default defineEventHandler(async (event) => {
  try {
    const dto = await readBody<AllotArticleDto>(event)
    const { _id, columnId } = dto
    const result = await articleService.allot(_id, columnId, event.context.auth.id)
    return {
      statusCode: 200,
      message: '分配项目成功!',
      data: result,
    }
  } catch (error) {
    // console.error('存在未设置授权码的项目！:' + error)
    throw createError({
      statusCode: 400,
      message: '分配项目失败!',
    })
  }
})