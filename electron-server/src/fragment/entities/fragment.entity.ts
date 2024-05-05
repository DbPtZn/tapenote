import { RemovedEnum } from 'src/enum'
export interface Fragment {
  _id: string
  audio: string
  duration: number
  txt: string
  transcript: string[]
  tags: string[]
  promoters: string[]
  timestamps: number[]
  role: number
  removed: RemovedEnum
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
