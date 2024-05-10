import { LibraryEnum } from 'src/enum'

export class GetRecentlyDto {
  lib: LibraryEnum
  skip: number
  take: number
}
