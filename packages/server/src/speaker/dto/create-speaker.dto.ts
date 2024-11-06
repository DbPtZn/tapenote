import { IsNotEmpty, IsString, Length, Max, Min, IsInt } from 'class-validator'

export class CreateSpeakerDto {
  @IsString()
  @Length(0, 255)
  model: string

  @IsString()
  type: 'human' | 'machine'

  @IsNotEmpty({ message: 'role 值不能为空' })
  @IsInt({ message: 'role 值必须为整数' })
  @Min(0, { message: 'role 值必须不能小于0' })
  @Max(99999, { message: 'role 值必须不能超过99999' })
  role: number

  @IsString()
  @Length(0, 36)
  name: string

  @IsString()
  @Length(0, 255)
  avatar: string

  @IsNotEmpty({ message: 'changer 值不能为空' })
  @IsInt({ message: 'changer 值必须为整数' })
  @Min(0, { message: 'changer 值必须大于0' })
  @Max(9999, { message: 'changer 值必须小于9999' })
  changer: number
}

// export class AddMachineDto {
//   @IsNotEmpty({ message: '机器人角色值不能为空' })
//   @IsInt({ message: '机器人角色值必须为整数' })
//   @Min(0, { message: '机器人角色值不能小于0' })
//   @Max(9999, { message: '机器人角色值不能超过9999' })
//   role: number

//   @IsString()
//   @Length(36)
//   name: string

//   @IsString()
//   @Length(255)
//   avatar: string
// }

// export class AddHumanDto {
//   @IsNotEmpty({ message: '扮演角色值不能为空' })
//   @IsInt({ message: '扮演角色值必须为整数' })
//   @Min(10000, { message: '扮演角色值必须不能小于10000' })
//   @Max(25000, { message: '扮演角色值必须不能超过25000' })
//   role: number

//   @IsString()
//   @Length(36)
//   name: string

//   @IsString()
//   @Length(255)
//   avatar: string

//   @IsInt({ message: '变声器值必须为整数' })
//   @Min(0, { message: '扮演角色值必须大于0' })
//   @Max(9999, { message: '扮演角色值必须小于25000' })
//   changer: number
// }
