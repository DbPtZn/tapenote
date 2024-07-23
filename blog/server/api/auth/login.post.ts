import bcrypt from 'bcryptjs'
import { User } from '~/server/models'
import { userService } from '~/services'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // TODO: use validation
  const { account, password } = await readBody(event)
  const user = await userService.validateUser(account, password)
  // console.log(user)
  if(!user) {
    // throw createError({
    //   statusCode: 401,
    //   message: '登录失败！',
    // })
    return null
  }
  const runtime = useRuntimeConfig()
  const accessToken = jwt.sign(
    {
      id: user._id,
      account: user.account,
      UID: user.UID
    },
    runtime.jwtSecret,
    { expiresIn: '1d' }
  )

  return accessToken
})