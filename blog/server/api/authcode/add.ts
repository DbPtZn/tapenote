import { authcodeService } from '~/services'

export default defineEventHandler(async (event) => {
  try {
    const authcode = await authcodeService.add(event.context.auth.id)
    return authcode
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      message: '添加授权码失败！',
    })
  }
})