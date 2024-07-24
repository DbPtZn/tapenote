import { CreateColumnDto } from "~/dto"
import { articleService, columnService } from "~/server/services"

export default defineEventHandler(async (event) => {
  try {
    const dto = await readBody<CreateColumnDto>(event)
    const result = await columnService.create(dto, event.context.auth.id, event.context.auth.UID)
    return result
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      message: '创建专栏失败！',
    })
  }
})                