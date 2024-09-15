import { IsBoolean, IsInt, IsNumber, IsString, Length } from 'class-validator'

export class UpdateUserConfigDto {
  @IsBoolean()
  autosave?: boolean // 是否自动保存

  @IsInt()
  saveInterval?: number // 自动保存间隔毫秒
}
