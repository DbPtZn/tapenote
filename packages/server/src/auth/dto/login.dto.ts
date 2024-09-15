import { IsString, Length } from 'class-validator'

export class LoginDto {
  // 邮箱
  @IsString()
  account: string

  // 密码
  @IsString()
  @Length(6, 128, {
    message: '密码错误'
  })
  password: string

  // 邮箱验证码
  @IsString()
  code: string
}
