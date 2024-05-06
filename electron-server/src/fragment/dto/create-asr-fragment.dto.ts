import { IsString } from 'class-validator'

export class CreateASRFragmentDto {
  @IsString() key: string
  @IsString() procedureId: string
  audio: Blob
  duration: number
  role: number
}
