import { IsString, IsNumber, IsOptional } from 'class-validator'

export class CreateTTSFragmentDto {
  @IsString() key: string
  @IsString() procedureId: string
  @IsString() txt: string
  @IsString() @IsOptional() speakerId?: string
  @IsNumber() speed: number
}
