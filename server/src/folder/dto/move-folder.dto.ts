import { IsString } from 'class-validator'
export enum DropPosition {
  BEFORE = 'before',
  INSIDE = 'inside',
  AFTER = 'after'
}
export class MoveFolderDto {
  // @IsMongoId()
  @IsString()
  sourceId: string

  // @IsMongoId()
  @IsString()
  targetId: string

  @IsString()
  dropPosition: DropPosition
}
