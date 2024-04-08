import { IsMongoId } from 'class-validator'
import { ObjectId } from 'mongodb'

export class CreateASRFragmentDto {
  @IsMongoId() procedureId: ObjectId
  audio: Blob
  duration: number
  role: number
}
