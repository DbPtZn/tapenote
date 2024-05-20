import { IsOptional, IsString, IsNumber } from 'class-validator'

export class CreateASRFragmentDto {
  @IsString() key: string
  @IsString() procedureId: string
  audio: Blob
  @IsNumber() duration: number
  @IsString() @IsOptional() speakerId?: string
}
