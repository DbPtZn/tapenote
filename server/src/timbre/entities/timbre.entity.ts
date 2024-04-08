import { ObjectId } from 'mongodb'
import { BeforeInsert, Column, Entity, ObjectIdColumn } from 'typeorm'
interface RoleList {
  key: number
  value: { name: string; avatar: string; changer: number }
}
interface RobotList {
  key: number
  value: { name: string; avatar: string }
}
@Entity()
export class Timbre {
  @ObjectIdColumn() _id: ObjectId

  @Column() userId: ObjectId // 用户 id

  @Column() role: number // 常用角色

  @Column() robot: number // 常用语音角色

  @Column() roleList: RoleList[] // 扮演角色列表

  @Column() robotList: RobotList[] // 合成语音列表
}
