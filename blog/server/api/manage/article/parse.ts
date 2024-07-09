import { ParseArticleDto } from '~/dto'
import { articleService } from '~/services'

export default defineEventHandler(async (event) => {
  try {
    console.log('parse')
    const dto = await readBody<ParseArticleDto>(event)
    const result = await articleService.parse(dto, event.context.auth.id, event.context.auth.UID)
    return {
      statusCode: 200,
      message: '解析项目成功!',
      data: result,
    }
  } catch (error) {
    // console.error('存在未设置授权码的项目！:' + error)
    throw createError({
      statusCode: 400,
      message: '解析项目失败!',
    })
  }
})