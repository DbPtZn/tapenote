import type { ObjectId } from "mongoose"

export interface CreateColumnDto {
  name: string
  cover: string
  desc: string
}