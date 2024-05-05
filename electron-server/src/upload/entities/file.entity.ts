export class UploadFile {
  _id: string

  userId: string // 用户ID

  md5: string // 文件MD5

  quote: string[] // 引用的项目 id

  type: string // 文件类型

  name: string // 文件名

  path: string // 文件路径

  size: number // 文件大小

  createAt: Date

  updateAt: Date

  // createDate() {
  //   this.createAt = new Date()
  //   this.updateAt = new Date()
  // }

  // /** 实体更新时自动更新时间 （仅在使用 save 方法进行更新时生效） */
  // updateDate() {
  //   this.updateAt = new Date()
  // }
}
