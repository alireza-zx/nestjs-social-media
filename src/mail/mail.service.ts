import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import crypto from 'crypto';

@Injectable()
export class MailService {
  constructor(
    // Inject MailerService
    private readonly mailerService: MailerService
  ) {}

  public async sendUserWelcome(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to NestJS social media!',
      template: './welcome',
      // the parameters to pass to template to use within the template
      context: {
        name: user.firstname + user.lastname,
        email: user.email
      }
    });
  }

  public async sendVerificationEmail(email: string, code: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email verification code for NestJS social media',
      template: './email-verification',
      // the parameters to pass to template to use within the template
      context: {
        code,
        email
      }
    });
  }
}