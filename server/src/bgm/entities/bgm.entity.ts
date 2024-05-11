import { User } from 'src/user/entities/user.entity'
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export interface BgmItem {
  id: string
  name: string
  audio: string
}

@Entity()
export class Bgm {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column() userId: string // 用户 id

  @OneToOne(() => User, user => user.bgm)
  user: User

  @Column({
    type: 'simple-json',
    default: JSON.stringify([])
  })
  list: BgmItem[]

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
