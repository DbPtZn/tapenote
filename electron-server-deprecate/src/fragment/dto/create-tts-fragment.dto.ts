import { IsString, IsNumber } from 'class-validator'
export class CreateTTSFragmentDto {
  @IsString() key: string
  @IsString() procedureId: string
  @IsString() txt: string
  @IsNumber() role?: number
  @IsNumber() speed: number
}
