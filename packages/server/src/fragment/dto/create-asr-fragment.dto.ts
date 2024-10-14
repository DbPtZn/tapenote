import { IsOptional, IsString, IsNumber } from 'class-validator'
export type Action = { animeId: string; serial: string; keyframe: number }
export class CreateASRFragmentDto {
  @IsString() key: string
  @IsString() procedureId: string
  audio: Blob
  actions: string // JSON 数据 { animeId: string, serial: string, keyframe: number }[]
  @IsString() duration: number
  @IsString() @IsOptional() speakerId?: string
}
