import { User } from 'src/user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

export interface BgmItem {
  id: string
  name: string
  audio: string
}

@Entity()
export class Bgm {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column() userId: string // 用户 id

  @ManyToOne(() => User, user => user.bgms)
  user: User

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  name: string

  @Column({
    type: 'varchar',
    length: 255,
    default: ''
  })
  audio: string

  @Column({
    type: 'float',
    default: 0
  })
  duration: number

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @DeleteDateColumn()
  deleteAt: Date
}
