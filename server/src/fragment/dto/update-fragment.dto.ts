import { IsNotEmpty, IsOptional, IsString, IsArray, IsNumber } from 'class-validator'
export class UpdateTranscriptDto {
  @IsNotEmpty() @IsString() procedureId: string
  @IsNotEmpty() @IsString() fragmentId: string
  @IsNotEmpty() @IsArray() newTranscript: string[]
}
export class RemoveFragmentDto {
  @IsNotEmpty() @IsString() procedureId: string
  @IsNotEmpty() @IsString() fragmentId: string
}
export class RestoreFragmentDto {
  @IsNotEmpty() @IsString() procedureId: string
  @IsNotEmpty() @IsString() fragmentId: string
}
export class DeleteFragmentDto {
  @IsNotEmpty() @IsString() procedureId: string
  @IsNotEmpty() @IsString() fragmentId: string
}
export class UpdateFragmentsTagsDto {
  @IsNotEmpty() @IsString() procedureId: string
  @IsNotEmpty() newData: {
    fragmentId: string
    tags: (string | null)[]
  }[]
}
export class AddPromoterDto {
  @IsNotEmpty() @IsString() procedureId: string
  @IsNotEmpty() @IsString() fragmentId: string
  @IsNotEmpty() @IsNumber() promoterIndex: number
  @IsNotEmpty() @IsString() promoterSerial: string
  @IsNotEmpty() @IsString() promoterId: string
}
export class RemovePromoterDto {
  @IsNotEmpty() @IsString() procedureId: string
  @IsNotEmpty() @IsString() fragmentId: string
  @IsNotEmpty() promoterIndex: number
}
export class UpdateSequenceDto {
  @IsNotEmpty() @IsString() procedureId: string
  @IsNotEmpty() @IsString() fragmentId: string
  @IsNotEmpty() @IsNumber() oldIndex: number
  @IsNotEmpty() @IsNumber() newIndex: number
}
