import type { ObjectId } from "mongoose"

export interface CreateArticleDto {
  isParsed: boolean // 是否已解析

  editorVersion: string // 编辑器版本号

  authorizeId: ObjectId // 授权码

  penname: string // 笔名

  email: string // 邮箱

  blog: string // 作者博客

  msg: string // 附加信息(在未分配时显示，分配后清除)

  type: 'course' | 'note' | unknown // 作品的类型

  title: string // 标题

  content: string // 内容

  abbrev: string // 缩略

  audio: string // 音频地址

  duration: number // 音频时长

  promoterSequence: Array<string> // 启动子序列

  keyframeSequence: Array<number> // 关键帧序列

  subtitleSequence: Array<string> // 字幕序列

  subtitleKeyframeSequence: Array<number> // 字幕关键帧序列
}