import { Types } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'
import type { ArticleSchema } from '~/types'
import { RemovedEnum } from '~/enums'
// import mongoosePaginate from 'mongoose-paginate'
import mongoosePaginateV2 from 'mongoose-paginate-v2'
import type { PaginateModel } from 'mongoose'
// mongoose.plugin(mongoosePaginate)
export const Article = defineMongooseModel<ArticleSchema>({
  name: 'Article',
  schema: {
    /** 一个较为简短的 ID，用来有限制地查询作品文章 (仅为普通访客查询展示必要的文章信息) */
    UID: {
      type: String,
      require: true
    },
    /** 版号：每个新项目拥有一个唯一的版号（更新稿件没有独立版号） */
    editionId: {
      type: String,
      required: false,
      unique: true
    },
    /** 隶属版号：来自项目的更新稿件会将此字段指向项目版号 */
    fromEditionId: {
      type: String,
      required: false
    },
    /** 用户 ID */
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    /** 授权 ID, 指向授权信息 */
    authcodeId: {
      type: Types.ObjectId,
      ref: 'Authcode'
    },
    /** 专栏 ID */
    columnId: {
      type: Types.ObjectId,
      ref: 'Column'
    },
    /** 是否完成解析 */
    isParsed: {
      type: Boolean,
      required: true,
      default: false
    },
    /** 投稿时携带的消息 */
    msg: {
      type: String,
      default: ''
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
    /** 类型 */
    type: {
      type: String,
      required: true,
      enum: ['note', 'course', 'other']
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
    /** 启动子序列 */
    promoterSequence: {
      type: [String],
      default: []
    },
    /** 关键帧序列 */
    keyframeSequence: {
      type: [String],
      default: []
    },
    /** 字幕序列 */
    subtitleSequence: {
      type: [String],
      default: []
    },
    /** 字幕关键帧序列 */
    subtitleKeyframeSequence: {
      type: [String],
      default: []
    },
    /** 标签 */
    tags: {
      type: [String],
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
    author: {
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
      /** 个人博客 */
      blog: {
        type: String,
        require: false,
        default: ''
      }
    },
    /** 作品详情 */
    detail: {
      /** 时长 */
      duration: {
        type: Number,
        require: false,
        default: 0
      },
      /** 字数 */
      wordage: {
        type: Number,
        require: false,
        default: 0
      },
      /** 文件大小（主要是项目中包含的音频文件和富文本数据（含图片）的大小） */
      filesize: {
        type: Number,
        require: false,
        default: 0
      }
    },
    meta: {
      // 看过数量
      views: { type: Number, default: 0 },
      // 喜欢数量
      likes: { type: Number, default: 0 },
      // 收藏数量
      collections: { type: Number, default: 0 },
      // 评论数量
      comments: { type: Number, default: 0 }
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
    timestamps: true,
    pluginTags: ['paginate']
  },
  hooks(schema) {
    // 可以在这里进行保存时的处理，比如校验、加密等
    schema.pre('save', function (this, next) {
      this.updateAt = new Date()
      next()
    })
    schema.plugin(mongoosePaginateV2)
  }
}) as PaginateModel<ArticleSchema>
// 使用了 mongoosePaginateV2 之后需要使用类型断言将 model 设置成 PaginateModel