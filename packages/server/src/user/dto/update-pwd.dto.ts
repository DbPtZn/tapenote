import { IsString, Length } from 'class-validator'

export class UpdateUserPwdDto {
  //旧密码
  @IsString()
  @Length(8, 24, {
    message: '密码长度必须在6~30个字符之间'
  })
  oldPwd: string

  //新密码
  @IsString()
  @Length(8, 24, {
    message: '密码长度必须在6~30个字符之间'
  })
  newPwd: string
}
