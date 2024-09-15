
import { defineMongooseModel } from '#nuxt/mongoose'
import { Types } from 'mongoose'
import type { UploadFileSchema } from '~/types'

export const UploadFile = defineMongooseModel<UploadFileSchema>({
  name: 'UploadFile',
  schema: {
    userId: {
      type: Types.ObjectId,
      require: true
    },
    /** 名称 */
    name: {
      type: String,
      require: true
    },
    /** 文件类型: image, audio */
    type: {
      type: String,
      require: true
    },
    /** 扩展名 */
    extname: {
      type: String,
      require: false
    },
    /** md5 */
    md5: {
      type: String,
      require: true
    },
    /** 文件大小 */
    size: {
      type: Number,
      require: false
    },
    /** 文件路径 */
    path: {
      type: String,
      require: true
    }
  },
  options: {
    timestamps: true
  }
})

