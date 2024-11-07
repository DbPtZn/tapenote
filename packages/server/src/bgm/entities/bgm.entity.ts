import { User } from 'src/user/entities/user.entity'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { uuidv7 } from 'uuidv7'

export interface BgmItem {
  id: string
  name: string
  audio: string
}

@Entity()
export class Bgm {
  @PrimaryColumn('uuid')
  id: string

  @BeforeInsert()
  generateUuid() {
    if(!this.id) this.id = uuidv7()
  }

  @Column('uuid') userId: string // 用户 id

  @ManyToOne(() => User, user => user.bgms)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
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
