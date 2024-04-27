import { ObjectId } from 'mongodb'
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class UploadFile {
  @ObjectIdColumn() _id: ObjectId

  @Column()
  userId: ObjectId // 用户ID

  @Column()
  md5: string // 文件MD5

  @Column()
  quote: string[] // 引用的项目 id

  @Column()
  type: string // 文件类型

  @Column()
  name: string // 文件名

  @Column()
  path: string // 文件路径

  @Column()
  size: number // 文件大小

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
    this.updateAt = new Date()
  }

  /** 实体更新时自动更新时间 （仅在使用 save 方法进行更新时生效） */
  @BeforeUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
