import { IsMongoId, IsString, IsNumber } from 'class-validator'
import { ObjectId } from 'mongodb'

export class CreateBlankFragmentDto {
  @IsMongoId() procedureId: ObjectId
  @IsNumber() txtLength: number
  @IsNumber() duration: number
}
