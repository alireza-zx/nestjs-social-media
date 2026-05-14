import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(64)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  password: string;
}