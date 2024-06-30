import { articleService, columnService } from "~/services"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    return []
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 401,
      message: '获取未解析文档数据失败！',
    })
  }
})                