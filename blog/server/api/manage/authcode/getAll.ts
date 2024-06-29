import { authcodeService } from '~/services'

export default defineEventHandler(async (event) => {
  try {
    const authcodes = await authcodeService.findAll(event.context.auth.id)
    return authcodes
  } catch (error) {
    console.error(error)
    throw createError({
      message: '添加授权码失败！',
    })
  }
})