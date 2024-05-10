import { RemovedEnum } from 'src/enum'
import { Project } from 'src/project/entities/project.entity'
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
// export interface Fragment {
//   _id: ObjectId
//   audio: string
//   duration: number
//   txt: string
//   transcript: string[]
//   tags: string[]
//   promoters: string[]
//   timestamps: number[]
//   role: number
//   removed: RemovedEnum
// }
export class Fragment {
  @PrimaryGeneratedColumn('uuid')
  id: string

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

  @Column({
    type: 'text',
    default: ''
  })
  txt: string

  // 可能包含逗号，不能使用 simple-array
  @Column({
    type: 'text',
    default: JSON.stringify([]),
    transformer: { to: value => JSON.stringify(value), from: value => JSON.parse(value) }
  })
  transcript: string[]

  @Column({
    type: 'simple-array'
  })
  tags: string[]

  @Column({
    type: 'simple-array'
  })
  promoters: string[]

  @Column({
    type: 'simple-array'
  })
  timestamps: number[]

  @Column({
    type: 'int'
  })
  role: number

  @Column({
    type: 'enum',
    enum: RemovedEnum,
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum

  @ManyToOne(() => Project, project => project.fragments)
  project: Project
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
