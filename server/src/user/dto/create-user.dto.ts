import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class CreateUserDto {
  // 昵称
  @IsString()
  nickname: string

  // account 账号
  @IsString()
  account: string

  //密码
  @IsString()
  @Length(6, 30, {
    message: '密码长度必须在6~30个字符之间'
  })
  password: string
}
