import { IsNotEmpty, IsString, Length, Max, Min, IsInt, IsNumber, IsEnum, min, IsOptional } from 'class-validator'

export class CreateSpeakerDto {
  @IsString()
  @Length(0, 255)
  model: string

  @IsString({
    groups: ['human', 'machine']
  })
  type: 'human' | 'machine'

  @IsOptional()
  @IsInt({ message: 'role 值必须为整数' })
  @Min(0, { message: 'role 值必须不能小于0' })
  role: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(3)
  speed: number

  @IsString()
  @Length(0, 36)
  name: string

  @IsString()
  @Length(0, 255)
  avatar: string

  @IsOptional()
  @IsInt({ message: 'changer 值必须为整数' })
  @Min(0, { message: 'changer 值必须大于0' })
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
