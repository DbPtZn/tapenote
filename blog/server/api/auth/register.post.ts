import bcrypt from 'bcryptjs'
import { User } from '~/models'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // TODO: use validation
  const { email, password, ...rest } = await readBody(event)
  const hashed = bcrypt.hashSync(password, 10)
  try {
    // await mongoose.connection.db.collection('users').insertOne({ email, password: hashed, ...rest })
    await User.create({
      data: {
        email,
        password: hashed,
        ...rest,
      },
    })
  } catch (error) {
    throw createError({
      statusMessage: 'user already registered.',
    })
  }

  // await setAuth(event, email)

  return {
    registered: true,
    user: email as string,
  }
})