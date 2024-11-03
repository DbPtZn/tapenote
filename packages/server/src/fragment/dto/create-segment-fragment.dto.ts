import { IsOptional, IsString, IsNumber } from 'class-validator'

export class CreateSegmentFragmentDto {
  @IsString() key: string
  @IsString() sourceFragmentId: string
  @IsString() duration: number
  @IsString() speaker: string
  @IsString() txt: string
  @IsString() timestamps: string
  @IsString() transcript: string
  @IsString() tags: string
  @IsString() promoters: string
}
