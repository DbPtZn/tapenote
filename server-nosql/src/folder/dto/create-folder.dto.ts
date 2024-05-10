import { ApiProperty } from '@nestjs/swagger'
import { Length, IsString, IsNotEmpty, IsMongoId } from 'class-validator'
import { ObjectId } from 'mongodb'
import { LibraryEnum } from 'src/enum'

export class CreateFolderDto {
  // 文件夹名称
  @ApiProperty({
    description: '文件夹名称',
    minLength: 1,
    maxLength: 32,
    example: '我的文件夹'
  })
  @Length(1, 18, {
    message: '文件夹名称不能超过18个字符'
  })
  @IsNotEmpty({
    message: '文件夹名称不能为空'
  })
  @IsString()
  name: string

  // 父文件夹 ID
  @ApiProperty({
    description: '父文件夹的 id',
    type: 'ObjectId',
    example: '64898a9082fb03294cf4ae02'
  })
  @IsMongoId()
  parentId: ObjectId

  // 文件夹隶属的库
  @IsString()
  lib: LibraryEnum

  // 文件夹描述
  @Length(0, 12, {
    message: '描述长度不能超过60个字符'
  })
  @IsString()
  desc: string

  // 文件夹的云同步
  // @IsBoolean()
  // isCloud: boolean
}

export const CreateFolderDto_Api = [{ name: 'id', description: '用户id', required: true }]
