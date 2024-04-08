import { ObjectId } from 'mongodb'
import { LibraryEnum, RemovedEnum } from 'src/enum'
import { AfterUpdate, BeforeInsert, Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'

@Entity()
// @Tree('adjacency-list')
export class Folder {
  @ObjectIdColumn() _id: ObjectId

  @Column() parentId: ObjectId

  @Column() userId: ObjectId

  @Column({
    length: 18,
    default: '未命名文件夹'
  })
  name: string // 文件夹名称

  @Column({
    length: 60,
    default: ''
  })
  desc: string // 描述

  @Column({
    type: 'enum',
    enum: LibraryEnum
  })
  lib: LibraryEnum // 库

  @Column()
  isCloud: boolean // 云同步

  @Column({
    type: 'enum',
    enum: RemovedEnum,
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum // 移除状态

  @CreateDateColumn()
  createAt: Date // 创建时间

  @UpdateDateColumn()
  updateAt: Date // 更新时间

  /** 插入实体时设置创建时间 */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
    this.removed = RemovedEnum.NEVER
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
