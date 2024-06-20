import bcrypt from 'bcryptjs'
import { User } from '~/models'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: use validation
  // console.log(event)
  console.log(event.context)
  const { account, password } = await readBody(event)
  console.log(account, password)
  // const hashed = bcrypt.hashSync(password, 10)
  // try {
  //   // await mongoose.connection.db.collection('users').insertOne({ email, password: hashed, ...rest })
  //   await User.create({
  //     data: {
  //       account,
  //       password: hashed,
  //       ...rest,
  //     },
  //   })
  // } catch (error) {
  //   throw createError({
  //     statusMessage: 'user already registered.',
  //   })
  // }

  // await setAuth(event, email)

  return {
    registered: true,
  }
})