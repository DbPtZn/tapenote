import { IsMongoId, IsString, IsNumber } from 'class-validator'
import { ObjectId } from 'mongodb'

export class CreateTTSFragmentDto {
  @IsString() key: string
  @IsMongoId() procedureId: ObjectId
  @IsString() txt: string
  @IsNumber() role?: number
  @IsNumber() speed: number
}
