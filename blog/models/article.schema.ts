import { Types, model } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'
import type { ArticleType } from '~/types'
import { RemovedEnum } from '~/enums'
console.log(defineMongooseModel)
export const Article = defineMongooseModel<ArticleType>({
  name: 'article',
  schema: {
    /** 一个较为简短的 ID，用来有限制地查询作品文章 (仅为普通访客查询展示必要的文章信息) */
    UID: {
      type: String,
      require: true,
      unique: true
    },
    /** 用户 ID */
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    /** 授权 ID, 指向授权信息 */
    authorizeId: {
      type: Types.ObjectId,
      ref: 'Authorize'
    },
    /** 专栏 ID */
    columnId: {
      type: Types.ObjectId,
      ref: 'Column'
    },
    /** 是否完成解析 */
    isParsed: {
      type: Boolean,
      default: false
    },
    /** 编辑器版本号 */
    editorVersion: {
      type: String,
      default: '0.0.0'
    },
    /** 封面 */
    cover: {
      type: String,
      default: ''
    },
    /** 标题 */
    title: {
      type: String,
      required: true
    },
    /** 正文 */
    content: {
      type: String,
      default: ''
    },
    /** 缩略文本 */
    abbrev: {
      type: String,
      default: ''
    },
    /** 音频 */
    audio: {
      type: String,
      default: ''
    },
    /** 时长 */
    duration: {
      type: Number,
      default: 0
    },
    /** 启动子序列 */
    promoterSequence: {
      type: Array<String>,
      default: []
    },
    /** 关键帧序列 */
    keyframeSequence: {
      type: Array<String>,
      default: []
    },
    /** 字幕序列 */
    subtitleSequence: {
      type: Array<String>,
      default: []
    },
    /** 字幕关键帧序列 */
    subtitleKeyframeSequence: {
      type: Array<String>,
      default: []
    },
    /** 标签 */
    tags: {
      type: Array<String>,
      default: []
    },
    /** 发布状态 */
    isPublish: {
      type: Boolean,
      require: true,
      default: false
    },
    removed: {
      type: String,
      require: true,
      default: RemovedEnum.NEVER
    },
    /** 作者信息 */
    /** 笔名 */
    penname: {
      type: String,
      require: false,
      default: ''
    },
    /** 邮箱 */
    email: {
      type: String,
      require: false,
      default: ''
    },
    /** 个人主页 */
    website: {
      type: String,
      require: false,
      default: ''
    },
    /** 作品详情 */
    wordage: {
      type: String,
      require: false,
      default: ''
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

