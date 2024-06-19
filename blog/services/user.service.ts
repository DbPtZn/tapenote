import type { ObjectId } from 'mongoose'
import { User } from '~/models'

class UserService {
  usersRepository: typeof User
  constructor() {
    this.usersRepository = User
  }

  async get(id: ObjectId) {
    try {
      const user = await this.usersRepository.findById(id)
      return user
    } catch (error) {
      throw error
    }
  }
}

export const userService = new UserService()