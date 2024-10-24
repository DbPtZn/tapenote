import { IsMongoId, IsOptional, IsString } from 'class-validator'

export class UpdateContentDto {
  @IsString()
  id: string

  @IsString()
  content: string

  @IsOptional()
  @IsString()
  cover: string
}
