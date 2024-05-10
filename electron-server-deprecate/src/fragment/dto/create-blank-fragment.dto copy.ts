import { IsString, IsNumber } from 'class-validator'

export class CreateBlankFragmentDto {
  @IsString() procedureId: string
  @IsNumber() txtLength: number
  @IsNumber() duration: number
}
