import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('app.mailHost'),
          port: configService.get('app.mailPort'),
          secure: configService.get('app.mailSecure'),
          auth: {
            user: configService.get('app.mailUsername'),
            pass: configService.get('app.mailPassword')
          }
        },
        defaults: {
          from: `NestJS social media <no-reply@nestjs-social-media.com>`
        },
        template: {
          dir: join(process.cwd(), 'src', 'mail', 'templates'),
          adapter: new EjsAdapter()
        }
      })
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}