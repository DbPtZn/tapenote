import { IsString } from 'class-validator'

export class UpdateSpeakerHistoryDto {
  @IsString()
  id: string

  @IsString()
  type: 'human' | 'machine'

  @IsString()
  speakerId: string
}

export class UpdateSpeakerRecorderDto {
  @IsString()
  id: string

  @IsString()
  speakerId: string
}
