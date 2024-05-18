import { IsInt, Max, Min, ValidationError, validate } from 'class-validator'
import { User } from 'src/user/entities/user.entity'
import {
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

type SpeakerType = 'human' | 'machine'

@Entity()
export class Speaker {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
    default: '',
    length: 36
  })
  model: string // 语音模型

  @Column({
    type: 'varchar',
    default: '',
    length: 36
  })
  type: SpeakerType // 角色类型

  @Column('uuid')
  userId: string // 用户 id

  @ManyToOne(() => User, user => user.speakers)
  user: User

  @Column({
    type: 'varchar',
    default: '',
    length: 255
  })
  avatar: string

  @Column({
    type: 'varchar',
    default: '',
    length: 36
  })
  name: string // 角色名称

  @Min(0, { message: 'role 值不能小于0' })
  @Max(99999, { message: 'role 值不能超过99999' })
  @IsInt({ message: 'role 值必须是整数' })
  @Column({
    type: 'int'
  })
  role: number // 角色值 0~9999 为 AI 语音预留 10000~99999 为用户角色预留

  @Max(99999, { message: 'changer 值不能超过9999' })
  @IsInt({ message: 'changer 值必须是整数' })
  @Column({
    type: 'int',
    nullable: true,
    default: 0
  })
  changer: number // 变声器 仅在 type 为 human 时生效

  @CreateDateColumn()
  createAt: Date // 创建时间

  @UpdateDateColumn()
  updateAt: Date // 更新时间

  /** 插入实体时设置创建时间 */
  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
  }

  /** 实体更新时自动更新时间 */
  @AfterUpdate()
  updateDate() {
    this.updateAt = new Date()
  }

  // 在插入或更新前执行校验
  @BeforeInsert()
  @BeforeUpdate()
  async validateUser() {
    const errors: ValidationError[] = await validate(this)
    if (errors.length > 0) {
      throw new Error('Validation failed')
    }
    if (this.type === 'human') {
      if (this.role < 10000) {
        throw new Error('type 为 human 时，role 取值不能小于10000')
      }
    }
    if (this.type === 'machine') {
      if (this.role > 9999) {
        throw new Error('type 为 machine 时，role 取值不能大于9999')
      }
    }
  }
}
