export interface AddSubmissionHistoryDto {
  id: string

  receiver: string
  editionId: string
  code: string
  title: string
  content?: string
  penname: string
  email: string
  blog: string
  msg: string
  date: string
}
