import type { ObjectId, Types } from 'mongoose'
import type { UpdateAuthcodeDto } from '~/dto'
import { Authcode } from '~/server/models'

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

  findOneByCode(code: string, userId: ObjectId) {
    try {
      return this.authcodesRepository.findOne({ code, userId })
    } catch (error) {
      throw error
    }
  }

  update(dto: UpdateAuthcodeDto, userId: ObjectId) {
    try {
      const { _id, ...data } = dto
      return this.authcodesRepository.findOneAndUpdate(
        { _id, userId }, 
        data, 
        { new: true }
      )
    } catch (error) {
      throw error
    }
  }

  delete(_id: Types.ObjectId, userId: ObjectId) {
    try {
      return this.authcodesRepository.deleteOne({ _id, userId })
    } catch (error) {
      throw error
    }
  }
}

export const authcodeService = new AuthcodeService()
