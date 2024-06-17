// import { ModuleOptions } from 'nuxt-mongoose'
import { Types } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'
console.log(defineMongooseModel)
export const ArticleSchema = defineMongooseModel({
  name: 'article',
  schema: {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: 'string',
      required: true,
    },
    slug: {
      type: 'string',
      required: true,
      unique: true,
    },
  },
  options: {
    timestamps: true,
  }
})