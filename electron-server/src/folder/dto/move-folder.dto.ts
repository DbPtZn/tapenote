import { IsString } from 'class-validator'
export enum DropPosition {
  BEFORE = 'before',
  INSIDE = 'inside',
  AFTER = 'after'
}
export class MoveFolderDto {
  @IsString()
  sourceId: string

  @IsString()
  targetId: string

  @IsString()
  dropPosition: DropPosition
}
