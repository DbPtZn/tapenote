import { Types, model } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'
import type { UserType } from '~/types'
import { RemovedEnum } from '~/enums'
// console.log(defineMongooseModel)
export const User = defineMongooseModel<UserType>({
  name: 'user',
  schema: {
    UID: {
      type: String,
      require: true,
      unique: true
    },
    /** 账号 */
    account: {
      type: String,
      maxlength: 32,
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
    info: {
      email: {
        type: String,
        maxlength: 100,
        require: false
      },
      phone: {
        type: String,
        maxlength: 13,
        require: false
      },
    },
    /**
     * 0 - 完全开放
     * 1 - 启用授权码模式
     * 2 - 禁止任何投稿
     */
    receiverConfig: {
      status: { type:  0 | 1 | 2, default: 0 },
      autoParse: { type: Boolean, default: false }, // 接收投稿时是否自动解析
      sizeLimit: { type: Number, default: 0 } // 接收文件大小的限制，0 表示无限制
    },
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

