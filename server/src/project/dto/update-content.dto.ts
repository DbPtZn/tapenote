import { IsMongoId, IsString } from 'class-validator'

export class UpdateContentDto {
  @IsString()
  id: string

  @IsString()
  content: string
}
