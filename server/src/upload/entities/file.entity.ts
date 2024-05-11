import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  Entity,
  Column,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class UploadFile {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column('uuid')
  userId: string // 用户ID

  @Column({
    type: 'varchar'
  })
  md5: string // 文件MD5

  @Column({
    type: 'simple-array'
  })
  quote: string[] // 引用的项目 id

  @Column({
    type: 'varchar',
    length: 24
  })
  type: string // 文件类型

  @Column({
    type: 'varchar',
    length: 255
  })
  name: string // 文件名

  @Column({
    type: 'varchar',
    length: 255
  })
  path: string // 文件路径

  @Column({
    type: 'int'
  })
  size: number // 文件大小

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @BeforeInsert()
  createDate() {
    this.createAt = new Date()
    this.updateAt = new Date()
  }

  /** 实体更新时自动更新时间 （仅在使用 save 方法进行更新时生效） */
  @BeforeUpdate()
  updateDate() {
    this.updateAt = new Date()
  }
}
