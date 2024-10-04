import { IsString, IsOptional, Length, IsBoolean, IsNumber } from 'class-validator'
export class AddMemoDto {
  @IsString() projectId: string
  @IsNumber() x: number
  @IsNumber() y: number
}

export class DeleteMemoDto {
  @IsString() projectId: string
  @IsString() memoId: string
}

export class UpdateMemoContentDto {
  @IsString() projectId: string
  @IsString() memoId: string
  @IsString() content: string
}

export class UpdateMemoStateDto {
  @IsString() projectId: string
  @IsString() memoId: string
  @IsBoolean() @IsOptional() isExpanded?: boolean
  @IsString() @IsOptional() bgColor?: 'yellow' | 'green' | 'pink' | 'purple' | 'blue' | 'white' | 'gray'
  @IsNumber() @IsOptional() height?: number
  @IsNumber() @IsOptional() width?: number
  @IsNumber() @IsOptional() x?: number
  @IsNumber() @IsOptional() y?: number
}

