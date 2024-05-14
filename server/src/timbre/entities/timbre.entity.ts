import { User } from 'src/user/entities/user.entity'
import { BeforeInsert, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
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
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  userId: string // 用户 id

  @OneToOne(() => User, user => user.timbre)
  user: User

  @Column({
    type: 'int'
  })
  role: number // 常用角色

  @Column({
    type: 'int'
  })
  robot: number // 常用语音角色

  @Column({
    type: 'simple-json',
    default: JSON.stringify([])
  })
  roleList: RoleList[] // 扮演角色列表

  @Column({
    type: 'simple-json',
    default: JSON.stringify([])
  })
  robotList: RobotList[] // 合成语音列表
}
