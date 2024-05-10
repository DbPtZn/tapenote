import { LibraryEnum, RemovedEnum } from 'src/enum'
import { Fragment } from 'src/fragment/entities/fragment.entity'

export interface Annotation {
  id: string
  content: string
  annotator: string
  updateAt: Date
  createAt: Date
}
export interface BGM {
  name: string
  audio: string
  volumn: number
}

export class Project {
  _id: string

  folderId: string // 文件夹 id

  userId: string // 用户 id

  library: LibraryEnum

  eidtorVersion: string

  dirname: string // 文件夹路径

  title: string // 标题

  content: string // 内容

  abbrev: string // 内容缩略

  removed: RemovedEnum

  /** ------------------------------------------ Procedure -------------------------------------------- */
  /** 文档中的所有片段 */
  fragments: Fragment[]

  /** 文档中的正常片段的顺序 */
  sequence: string[]

  /** 文档中的被移除片段的顺序 */
  removedSequence: string[]

  /** ------------------------------------------ Procedure -------------------------------------------- */

  fromNoteId: string

  bgm: BGM // 背景音乐

  /** ------------------------------------------  course  -------------------------------------------- */
  fromProcedureId: string

  sidenote: string

  audio: string // 音频地址

  duration: number // 音频时长

  promoterSequence: Array<string> // 启动子序列

  keyframeSequence: Array<number> // 关键帧序列

  subtitleSequence: Array<string> // 字幕序列

  subtitleKeyframeSequence: Array<number> // 字幕关键帧序列

  annotations: Annotation[]

  /** ------------------------------------------  course  -------------------------------------------- */

  createAt: Date

  updateAt: Date

  snapshot: {
    version: number // 版本号
    date: Date // 版本时间
    remarks: string // 备注
  }

  isSnapshot: boolean // 是否属于快照（快照不可编辑，且不会显示在项目列表中）


  isReplica: boolean // 是否属于快照的副本（快照副本可编辑，但不会显示在项目列表中）

  /** 详情 */
  detail: {
    penname: string
    homepage: string
    email: string
    wordage: number // 字数
    filesize: number // 文件大小(包含音频文件、文本、图片)
  }

  /** 插入实体时设置创建时间 （仅在使用 save 方法进行更新时生效） */
  // createDate() {
  //   this.createAt = new Date()
  //   this.updateAt = new Date()
  //   this.removed = RemovedEnum.NEVER
  // }

  /** 实体更新时自动更新时间 （仅在使用 save 方法进行更新时生效） */
  // updateDate() {
  //   this.updateAt = new Date()
  // }
}
