import { IsMongoId, IsString } from 'class-validator'
import { ObjectId } from 'mongodb'

export class CreateASRFragmentDto {
  @IsString() key: string
  @IsMongoId() procedureId: ObjectId
  audio: Blob
  duration: number
  role: number
}
