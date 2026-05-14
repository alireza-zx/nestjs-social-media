import { Module } from '@nestjs/common';
import { VerificationCodeService } from './verification-code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationCode } from './email-verification-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailVerificationCode])
  ],
  providers: [VerificationCodeService],
  exports: [VerificationCodeService]
})
export class VerificationCodeModule {}