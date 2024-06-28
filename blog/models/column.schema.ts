
import { defineMongooseModel } from '#nuxt/mongoose'
import { Types } from 'mongoose'
import { RemovedEnum } from '~/enums'
import type { ColumnSchema } from '~/types'

export const Column = defineMongooseModel<ColumnSchema>({
  name: 'Column',
  schema: {
    /** 用户 ID */
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
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
    name: {
      type: String,
      maxlength: 32,
      default: '',
      require: true
    },
    isPublish: {
      type: Boolean,
      default: false
    },
    removed: {
      type: String,
      require: true,
      default: RemovedEnum.NEVER
    },
    // 创建时间
    createAt: {
      type: Date,
      default: new Date()
    },
    // 修改时间
    updateAt: {
      type: Date,
      default: new Date()
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

