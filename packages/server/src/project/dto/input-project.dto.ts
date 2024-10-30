import { IsString, IsOptional, Length } from 'class-validator'

export class InputProjectDto {
  @IsString() @IsOptional() @Length(0, 100) folderId: string

  @IsString()
  lib: string

  @IsString()
  title: string

  @IsString()
  content: string
  
  @IsString()
  @IsOptional()
  firstPictrue

  @IsString()
  @IsOptional()
  cover: string

  @IsString() @IsOptional() @Length(0, 100) penname: string
  @IsString() @IsOptional() @Length(0, 100) email: string // 这里面向非标准产品，不要求严格验证邮箱 IsEmail
  @IsString() @IsOptional() @Length(0, 200) homepage: string
}
