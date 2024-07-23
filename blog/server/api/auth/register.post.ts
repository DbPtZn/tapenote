import bcrypt from 'bcryptjs'
import { User } from '~/server/models'
import { userService } from '~/services'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: use validation
  const { nickname, account, password } = await readBody(event)
  console.log(account, password)
  // const hashed = bcrypt.hashSync(password, 10)
  try {
    await userService.create({
      nickname,
      account,
      password
    })
    return {
      msg: '注册成功！'
    }
  } catch (error) {
    console.error(error)
    throw createError({
      message: '注册失败！',
    })
  }
})