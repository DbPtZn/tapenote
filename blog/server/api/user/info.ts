import { userService } from "~/services"

export default defineEventHandler(async (event) => {
  try {
    const user = await userService.findUserInfo(event.context.auth.id)
    return user
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 401,
      message: '获取用户信息失败！',
    })
  }
})