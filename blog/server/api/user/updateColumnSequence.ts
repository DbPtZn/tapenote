import { UpdateColumnSequenceDto } from "~/dto"
import { userService } from "~/services"

export default defineEventHandler(async (event) => {
  try {
    const dto = await readBody<UpdateColumnSequenceDto>(event)
    // console.log(status)
    const result = await userService.updateColumnsSequence(dto, event.context.auth.id)
    if (result.acknowledged) return { message: '专栏序列更新成功！' }
    else throw new Error('专栏序列更新失败！')
  } catch (error) {
    // console.error(error)
    throw createError({
      statusCode: 400,
      message: '专栏序列更新失败！',
    })
  }
})