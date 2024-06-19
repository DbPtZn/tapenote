import { Types, model } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'
import type { ArticleType } from '~/types'
import { RemovedEnum } from '~/enums'
console.log(defineMongooseModel)
export const Article = defineMongooseModel<ArticleType>({
  name: 'article',
  schema: {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: 'string',
      required: true
    },
    content: {
      type: 'string',
      default: ''
    },
    removed: {
      type: String,
      require: true,
      default: RemovedEnum.NEVER
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
  }
})

