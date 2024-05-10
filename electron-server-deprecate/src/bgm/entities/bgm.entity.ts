export interface BgmItem {
  id: string
  name: string
  audio: string
}

export class Bgm {
  _id: string

  userId: string // 用户 id

  list: BgmItem[]

  createAt: Date

  updateAt: Date
}
