import { PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserSubmissionConfigDto {
  id: string
  name: string
  site: string
  code: string
  desc: string
}
