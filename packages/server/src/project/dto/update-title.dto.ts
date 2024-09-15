import { IsString } from 'class-validator'

export class UpdateTitleDto {
  @IsString()
  id: string

  @IsString()
  title: string
}
