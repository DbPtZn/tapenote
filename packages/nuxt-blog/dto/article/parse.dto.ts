import type { ObjectId } from "mongoose"

export interface ParseArticleDto {
  _id: string

  // title: string // 标题
  
  cover: string // 封面

  content: string // 内容

  duration: number // 音频时长

  promoterSequence: Array<string> // 启动子序列

  keyframeSequence: Array<number> // 关键帧序列

  subtitleSequence: Array<string> // 字幕序列

  subtitleKeyframeSequence: Array<number> // 字幕关键帧序列
}