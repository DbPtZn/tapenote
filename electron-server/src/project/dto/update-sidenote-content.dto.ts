import { PartialType } from '@nestjs/swagger'
import { IsMongoId, IsString } from 'class-validator'
import { ObjectId } from 'mongodb'

export class UpdateSidenoteContentDto {
  @IsMongoId()
  id: ObjectId

  @IsString()
  content: string
}
