import { articleService } from "~/services"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const articles = await columnService.findAllUnParsed(event.context.auth.id)
    return articles
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 401,
      message: '获取未解析文档数据失败！',
    })
  }
})