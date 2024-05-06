import { Length, IsString, IsNotEmpty, IsMongoId } from 'class-validator'

import { LibraryEnum } from 'src/enum'

export class CreateFolderDto {
  // 文件夹名称
  @Length(1, 18, {
    message: '文件夹名称不能超过18个字符'
  })
  @IsNotEmpty({
    message: '文件夹名称不能为空'
  })
  @IsString()
  name: string

  // 父文件夹 ID
  @IsString()
  parentId: string

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

// export const CreateFolderDto_Api = [{ name: 'id', description: '用户id', required: true }]
