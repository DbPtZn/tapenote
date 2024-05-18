import { IsNotEmpty, IsString, Length, Max, Min, IsInt } from 'class-validator'

export class AddRobotDto {
  @IsNotEmpty({ message: '机器人角色值不能为空' })
  @IsInt({ message: '机器人角色值必须为整数' })
  @Min(0, { message: '机器人角色值不能小于0' })
  @Max(9999, { message: '机器人角色值不能超过9999' })
  role: number

  @IsString()
  @Length(36)
  name: string

  @IsString()
  @Length(255)
  avatar: string
}

export class AddRoleDto {
  @IsNotEmpty({ message: '扮演角色值不能为空' })
  @IsInt({ message: '扮演角色值必须为整数' })
  @Min(10000, { message: '扮演角色值必须不能小于10000' })
  @Max(25000, { message: '扮演角色值必须不能超过25000' })
  role: number

  @IsString()
  @Length(36)
  name: string

  @IsString()
  @Length(255)
  avatar: string

  @IsInt({ message: '变声器值必须为整数' })
  @Min(0, { message: '扮演角色值必须大于0' })
  @Max(9999, { message: '扮演角色值必须小于25000' })
  changer: number
}
