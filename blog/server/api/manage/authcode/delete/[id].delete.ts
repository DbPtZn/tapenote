import { Types } from 'mongoose'
import { authcodeService } from '~/services'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    console.log(id)
    await authcodeService.delete(new Types.ObjectId(id), event.context.auth.id)
    return {
      statusCode: 200,
      message: '删除授权码成功！',
    }
  } catch (error) {
    console.error(error)
    throw createError({
      message: '删除授权码失败！',
    })
  }
})