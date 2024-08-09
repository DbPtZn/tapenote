import { SubmissionHistory } from '../entities/project.entity'
export class AddSubmissionHistoryDto {
  id: string

  receiver: string
  editionId: string
  address: string
  code: string
  title: string
  content?: string
  penname: string
  email: string
  blog: string
  msg: string
  date: string
}
