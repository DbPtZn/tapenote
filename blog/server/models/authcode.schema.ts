import { Types } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'
import type { AuthCodeSchema } from '~/types'
import mongoosePaginateV2 from 'mongoose-paginate-v2'
export const Authcode = defineMongooseModel<AuthCodeSchema>({
  name: 'Authcode',
  schema: {
    /** 用户 ID */
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      maxlength: 24,
      require: false,
      default: ''
    },
    code: {
      type: String,
      maxlength: 64,
      require: true,
      unique: true
    },
    /** 禁用状态 */
    disabled: {
      type: Boolean,
      require: true,
      default: false
    },
    desc: {
      type: String,
      maxlength: 128,
      require: false,
      default: '' 
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
    // schema.pre('init', function (this, next) {
    //   console.log('authcode init')
    //   this.createAt = new Date()
    //   this.updateAt = new Date()
    //   next()
    // })
    schema.pre('save', function (this, next) {
      this.updateAt = new Date()
      next()
    }),
    schema.plugin(mongoosePaginateV2)
  }
})
