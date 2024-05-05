import { LibraryEnum, RemovedEnum } from 'src/enum'

export class Folder {
  _id: string

  parentId: string

  userId: string

  name: string // 文件夹名称

  desc: string // 描述

  lib: LibraryEnum // 库

  isCloud: boolean // 云同步

  removed: RemovedEnum // 移除状态

  createAt: Date // 创建时间

  updateAt: Date // 更新时间

  /** 插入实体时设置创建时间 */
  // createDate() {
  //   this.createAt = new Date()
  //   this.removed = RemovedEnum.NEVER
  // }

  // /** 实体更新时自动更新时间 */
  // updateDate() {
  //   this.updateAt = new Date()
  // }
}
