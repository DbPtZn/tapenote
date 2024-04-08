import { ObjectId } from 'mongodb'
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'

export interface BgmItem {
  id: string
  name: string
  audio: string
}

@Entity()
export class Bgm {
  @ObjectIdColumn() _id: ObjectId

  @Column() userId: ObjectId // 用户 id

  @Column({
    default: []
  })
  list: BgmItem[]

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
