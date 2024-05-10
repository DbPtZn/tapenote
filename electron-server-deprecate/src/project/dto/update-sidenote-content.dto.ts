import { IsMongoId, IsString } from 'class-validator'

export class UpdateSidenoteContentDto {
  @IsString()
  id: string

  @IsString()
  content: string
}
