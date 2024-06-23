import type { ObjectId } from 'mongoose'
import { Authcode } from '~/models'

class AuthcodeService {
  authcodesRepository: typeof Authcode
  constructor() {
    this.authcodesRepository = Authcode
  }

  add(userId: ObjectId) {
    try {
      return this.authcodesRepository.create({
        userId: userId,
        name: '',
        code: '',
        desc: ''
      })
    } catch (error) {
      throw error
    }
  }

  findAll(userId: ObjectId) {
    try {
      return this.authcodesRepository.find({ userId: userId })
    } catch (error) {
      throw error
    }
  }

  findOne(_id: ObjectId, userId: ObjectId) {
    try {
      return this.authcodesRepository.findOne({ _id, userId })
    } catch (error) {
      throw error
    }
  }

  update(_id: ObjectId, data: any) {
    try {
      return this.authcodesRepository.updateOne({ _id }, data)
    } catch (error) {
      throw error
    }
  }

  delete(_id: ObjectId, userId: ObjectId) {
    try {
      return this.authcodesRepository.deleteOne({ _id, userId })
    } catch (error) {
      throw error
    }
  }
}

export const authcodeService = new AuthcodeService()
