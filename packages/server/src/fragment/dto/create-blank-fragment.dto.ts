import { IsString, IsNumber, IsArray } from 'class-validator'
export class CreateBlankFragmentDto {
  @IsString() procedureId: string
  @IsNumber() txtLength: number
  @IsNumber() duration: number
  @IsArray() actions: { animeId: string, serial: string, keyframe: number }[]
}
