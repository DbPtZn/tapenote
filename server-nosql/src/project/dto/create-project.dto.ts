import { IsEmpty, IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
import { ObjectId } from 'mongodb'
import { LibraryEnum } from 'src/enum'

export class CreateProjectDto {
  @IsString() @IsNotEmpty() @Length(0, 100) library: LibraryEnum
  @IsMongoId() @Length(0, 100) folderId: ObjectId
  @IsMongoId() @IsOptional() @Length(0, 100) noteId: string
  @IsMongoId() @IsOptional() @Length(0, 100) procedureId: string
  @IsString() @IsOptional() @Length(0, 100) penname: string
  @IsString() @IsOptional() @Length(0, 100) email: string // 这里面向非标准产品，不要求严格验证邮箱 IsEmail
  @IsString() @IsOptional() @Length(0, 200) homepage: string // 这里面向非标准产品，不要求严格验证网址 IsUrl
}