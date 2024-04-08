import { IsMongoId, IsString } from 'class-validator'
import { ObjectId } from 'mongodb'

export class UpdateContentDto {
  @IsMongoId()
  id: ObjectId

  @IsString()
  content: string
}
