import { IsOptional, IsString, IsNumber } from 'class-validator'

export class CreateSegmentFragmentDto {
  @IsString() key: string
  @IsString() procedureId: string
  @IsString() sourceFragmentId: string
  @IsString() removeSourceFragment: string
  audio: Blob
  @IsString() duration: number
  @IsString() speaker: string
  @IsString() txt: string
  @IsString() timestamps: string
  @IsString() transcript: string
  @IsString() tags: string
  @IsString() promoters: string
}
