import { IsOptional } from "class-validator";

export class VerificationCodeQueryDto {
  @IsOptional()
  verificationCode?: number;
}