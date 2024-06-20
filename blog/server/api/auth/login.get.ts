import bcrypt from 'bcryptjs'
import { User } from '~/models'

export default defineEventHandler(async (event) => {
  // TODO: use validation

  return {
    login: true
  }
})