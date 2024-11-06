import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator'

export class CreateTTSFragmentDto {
  @IsString() procedureId: string
  @IsNumber() speed: number
  @IsString() @IsOptional() speakerId?: string
  // @IsString() key: string
  @IsArray() data: { txt: string, key: string }[]
}
