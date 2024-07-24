import { AllotArticleDto } from '~/dto'
import { articleService } from '~/server/services'

export default defineEventHandler(async (event) => {
  try {
    console.log('allot')
    const dto = await readBody<AllotArticleDto>(event)
    const { articleId, columnId } = dto
    const result = await articleService.allot(articleId, columnId, event.context.auth.id)
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