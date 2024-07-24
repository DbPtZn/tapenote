import { authcodeService } from '~/server/services'

export default defineEventHandler(async (event) => {
  try {
    const authcode = await authcodeService.add(event.context.auth.id)
    return authcode
  } catch (error) {
    // console.error('存在未设置授权码的项目！:' + error)
    throw createError({
      statusCode: 400,
      message: '添加授权码失败, 存在未设置授权码的项目!',
    })
  }
})