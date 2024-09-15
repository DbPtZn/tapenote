import { userService } from "~/server/services"

export default defineEventHandler(async (event) => {
  try {
    const users = await userService.findAll()
    console.log(users)
    return users
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 401,
      message: '获取用户信息失败！',
    })
  }
})