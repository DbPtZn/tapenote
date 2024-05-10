import { CreateUserDto } from './create-user.dto'
import { IsString, Length, IsEmpty } from 'class-validator'

export class UpdateUserDto {
  // @IsString()
  nickname: string

  // @IsString()
  avatar: string

  // @IsString()
  email: string

  // @IsString()
  phone: string

  homepage: string

  // @IsString()
  desc: string
}
