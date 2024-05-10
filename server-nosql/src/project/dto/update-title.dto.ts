import { ObjectId } from 'mongodb'
import { IsMongoId, IsString } from 'class-validator'

export class UpdateTitleDto {
  @IsMongoId()
  id: ObjectId

  @IsString()
  title: string
}
