import { authcodeService } from '~/services'

export default defineEventHandler(async (event) => {
  try {
    const { _id } = await readBody(event)
    const authcode = await authcodeService.findOne(_id, event.context.auth.id)
    return authcode
  } catch (error) {
    console.error(error)
    throw createError({
      message: '获取授权码失败！',
    })
  }
})