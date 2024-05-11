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

  // // 验证码
  // @IsString()
  // code: string

  // // 加密验证码
  // @IsString()
  // hashCode: string
}
