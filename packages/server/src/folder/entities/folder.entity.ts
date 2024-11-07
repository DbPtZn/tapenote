import { LibraryEnum, RemovedEnum } from 'src/enum'
import { Project } from 'src/project/entities/project.entity'
import { User } from 'src/user/entities/user.entity'
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  JoinColumn
} from 'typeorm'
import { uuidv7 } from 'uuidv7'

@Entity()
@Tree('adjacency-list')
export class Folder {
  @PrimaryColumn('uuid')
  id: string

  @BeforeInsert()
  generateUuid() {
    if(!this.id) this.id = uuidv7()
  }

  @Column({
    type: 'uuid',
    nullable: true
  })
  parentId: string

  // 邻接列表
  @ManyToOne(type => Folder, folder => folder.children)
  parent: Folder

  // 邻接列表
  @OneToMany(type => Folder, folder => folder.parent)
  children: Folder[]

  @Column('uuid')
  userId: string

  @ManyToOne(() => User, user => user.folders)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User

  @OneToMany(() => Project, project => project.folder)
  projects: Project[]

  @Column({
    length: 18,
    default: '未命名文件夹'
  })
  name: string // 文件夹名称

  @Column({
    type: 'varchar',
    length: 60,
    default: ''
  })
  desc: string // 描述

  @Column({
    type: 'varchar'
    // type: 'enum',
    // enum: LibraryEnum
  })
  lib: LibraryEnum // 库

  @Column({
    type: 'boolean',
    default: false
  })
  isCloud: boolean // 云同步

  @Column({
    type: 'varchar',
    default: RemovedEnum.NEVER
  })
  removed: RemovedEnum // 移除状态

  @CreateDateColumn()
  createAt: Date // 创建时间

  @UpdateDateColumn()
  updateAt: Date // 更新时间

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
    if (this.parent && this.parentId !== this.parent.id) {
      console.log('parentId:' + this.parentId)
      console.log('parent.id:' + this.parent.id)
      console.log('警告⚠：当前更新的文件夹[parentId !== parent.id]')
    }
  }
}
