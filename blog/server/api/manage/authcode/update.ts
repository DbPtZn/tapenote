import { UpdateAuthcodeDto } from "~/dto"
import { authcodeService } from "~/services"

export default defineEventHandler(async (event) => {
  try {
    const dto = await readBody<UpdateAuthcodeDto>(event)
    // console.log(dto)
    const authcode = await authcodeService.update(dto, event.context.auth.id)
    // console.log(authcode)
    return authcode
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      message: '添加授权码失败！',
    })
  }
})