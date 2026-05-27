import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  description: string;
}