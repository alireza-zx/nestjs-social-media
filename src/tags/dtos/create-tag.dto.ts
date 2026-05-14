import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTagDto {
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  title: string;
}