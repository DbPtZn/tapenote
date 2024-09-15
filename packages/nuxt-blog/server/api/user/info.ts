import { userService } from "~/server/services"

export default defineEventHandler(async (event) => {
  try {
    if(event.context.auth && event.context.auth.id) {
      const user = await userService.findUserInfo(event.context.auth.id)
      return user
    } else {
      throw new Error('权限不足！')
    }
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 401,
      message: '获取用户信息失败！',
    })
  }
})