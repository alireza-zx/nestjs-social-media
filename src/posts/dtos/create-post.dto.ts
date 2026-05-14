import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  description: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tagsIds: string[];
}