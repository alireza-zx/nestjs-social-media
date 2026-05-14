import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationCode } from './email-verification-code.entity';
import { Repository } from 'typeorm';
import crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class VerificationCodeService {
  constructor(
    // Inject EmailVerificationCodeRepository
    @InjectRepository(EmailVerificationCode)
    private readonly emailVerificationCodeRepository: Repository<EmailVerificationCode>,
    // Inject MailService
    private readonly mailService: MailService,
  ) {}

  private generateRandomCode(min: number, max: number): Promise<number> {
    return new Promise((res, rej) => {
      crypto.randomInt(min, max, (err: Error | null, num: number) => {
        if (err) rej(err);
        res(num);
      });
    });
  }

  public async createCode(email: string) {
    const code = await this.generateRandomCode(100000, 1000000);

    const emailVerificationCodeInstance =
      this.emailVerificationCodeRepository.create({
        email,
        code,
      });

    return await this.emailVerificationCodeRepository.save(
      emailVerificationCodeInstance,
    );
  }

  public async sendVerificationEmail(email: string) {
    const verificationCode =
      await this.emailVerificationCodeRepository.findOneBy({ email });
    if (verificationCode) {
      if (verificationCode.expiresAt.getTime() < Date.now()) {
        await this.emailVerificationCodeRepository.remove(verificationCode);

        const code = await this.generateRandomCode(100000, 1000000);
        const newVerificationCodeInstance =
          this.emailVerificationCodeRepository.create({
            email,
            code,
          });
        const newVerificationCode =
          await this.emailVerificationCodeRepository.save(
            newVerificationCodeInstance,
          );

        await this.mailService.sendVerificationEmail(
          newVerificationCode.email,
          newVerificationCode.code,
        );
        return newVerificationCode;
      }
      throw new BadRequestException(
        'you can request another verification code in 5 minutes',
      );
    }
    const code = await this.generateRandomCode(100000, 1000000);
    const newVerificationCodeInstance =
      this.emailVerificationCodeRepository.create({
        email,
        code,
      });
    const newVerificationCode = await this.emailVerificationCodeRepository.save(
      newVerificationCodeInstance,
    );

    await this.mailService.sendVerificationEmail(
      newVerificationCode.email,
      newVerificationCode.code,
    );
    return newVerificationCode;
  }

  public async verify(email: string, code: number) {
    const verificationCode = await this.emailVerificationCodeRepository.findOneBy({ email, code });

    if (!verificationCode)
      throw new BadRequestException('invalid code');

    if (verificationCode.expiresAt.getTime() < Date.now()) {
      await this.emailVerificationCodeRepository.remove(verificationCode);
      throw new BadRequestException('code has expired');
    }

    return verificationCode;
  }
}