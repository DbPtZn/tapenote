import { CreateColumnDto } from "~/dto"
import { articleService, columnService } from "~/services"

export default defineEventHandler(async (event) => {
  try {
    const result = await columnService.getColumns(event.context.auth.id)
    return result
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      message: '获取专栏数据失败！',
    })
  }
})                