import { RemovedEnum } from 'src/enum'
import { Project } from 'src/project/entities/project.entity'
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { uuidv7 } from 'uuidv7'

export interface FragmentSpeaker {
  id: string
  type: 'human' | 'machine'
  model: string
  avatar: string
  name: string
  role: number
  changer: number
  speed: number
}
@Entity()
export class Fragment {
  @PrimaryColumn({
    type: 'varchar',
    length: 36
  })
  id: string

  @BeforeInsert()
  generateUuid() {
    if(!this.id) this.id = uuidv7()
  }

  @Column({
    type: 'varchar',
    length: 36,
    nullable: true
  })
  userId: string

  @ManyToOne(() => Project, project => project.fragments)
  project: Project

  @Column({
    type: 'varchar',
    length: 36,
    default: ''
  })
  audio: string

  @Column({
    type: 'float',
    default: 0
  })
  duration: number

  @Column({
    type: 'text'
  })
  txt: string

  // 注意：可能包含逗号，不能使用 simple-array
  @Column({
    type: 'simple-json'
  })
  transcript: string[]

  @Column({
    type: 'simple-json'
  })
  tags: string[]

  @Column({
    type: 'simple-json'
  })
  promoters: string[]

  @Column({
    type: 'simple-json'
  })
  timestamps: number[]

  @Column({
    type: 'simple-json'
  })
  speaker: FragmentSpeaker

  @Column({
    type: 'boolean',
    default: false
  })
  collapsed: boolean

  @Column({
    type: 'varchar',
    length: 8,
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum

  /** 创建时间 */
  @CreateDateColumn() createAt: Date
  /** 更新时间 */
  @UpdateDateColumn() updateAt: Date
  /** 软删除时间 */
  @DeleteDateColumn()
  deleteAt: Date

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

  // @BeforeRemove()
  // removeAudio() {
  //   this.audio
  // }
}
// export class Fragment {
//   @ObjectIdColumn() _id: ObjectId
//   /** 关联的工程文件 id */
//   @Column() procedureId: ObjectId
//   /** 音频地址 */
//   @Column() audio: string
//   /** 音频时长 */
//   @Column() duration: number
//   /** 转写文本 */
//   @Column() transcript: string[]
//   /** 标记状态 */
//   @Column() tags: string[]
//   /** 启动子（指向文本中的动画块） */
//   @Column() promoters: string[]
//   /** 排序 */
//   @Column() sortNum: number
//   /** 角色 */
//   @Column() role: string
//   /** 删除状态 */
//   @Column({
//     type: 'enum',
//     enum: RemovedEnum,
//     default: RemovedEnum.NEVER
//   })
//   removed: RemovedEnum
//   /** 创建时间 */
//   @CreateDateColumn() createAt: Date
//   /** 更新时间 */
//   @UpdateDateColumn() updateAt: Date

//   /** 插入实体时设置创建时间 */
//   @BeforeInsert()
//   createDate() {
//     this.createAt = new Date()
//     this.removed = RemovedEnum.NEVER
//   }

//   /** 实体更新时自动更新时间 */
//   @AfterUpdate()
//   updateDate() {
//     this.updateAt = new Date()
//   }
// }
