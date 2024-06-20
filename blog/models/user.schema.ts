import { Types, model } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'
import type { UserType } from '~/types'
import { RemovedEnum } from '~/enums'
// console.log(defineMongooseModel)
export const User = defineMongooseModel<UserType>({
  name: 'user',
  schema: {
    /** 账号 */
    account: {
      type: String,
      maxlength: 24,
      require: true
    },
    password: {
      type: String,
      maxlength: 64,
      require: true
    },
    nickname: {
      type: String,
      maxlength: 24,
      require: false,
      default: ''
    },
    avatar: {
      type: String,
      maxlength: 255,
      require: false,
      default: ''
    },
    desc: {
      type: String,
      maxlength: 255,
      require: false,
      default: ''
    },
    // email: {
    //   type: String,
    //   maxlength: 100,
    //   require: false
    // },
    // phone: {
    //   type: String,
    //   maxlength: 13,
    //   require: false
    // },
    // 创建时间
    createAt: {
      type: Date,
      default: Date.now()
    },
    // 修改时间
    updateAt: {
      type: Date,
      default: Date.now()
    }
  },
  options: {
    timestamps: true
  },
  hooks(schema) {
    // 可以在这里进行保存时的处理，比如校验、加密等
    schema.pre('save', function (this, next) {
      this.updateAt = new Date()
      next()
    })
  },
})

