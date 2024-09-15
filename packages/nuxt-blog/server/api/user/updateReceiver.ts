import { userService } from "~/server/services"

export default defineEventHandler(async (event) => {
  try {
    const { status } = await readBody(event)
    // console.log(status)
    const result = await userService.updateReceiverConfig(status, event.context.auth.id)
    if (result.acknowledged) return { message: '接收模式更新成功！' }
    else throw new Error('接收模式更新失败！')
  } catch (error) {
    // console.error(error)
    throw createError({
      statusCode: 400,
      message: '接收模式更新失败！',
    })
  }
})