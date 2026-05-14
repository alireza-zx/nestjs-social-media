import { Module } from '@nestjs/common';
import { JwtAccessService } from './jwt.access.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get('jwt.accessTtl'),
        },
      }),
    }),
  ],
  providers: [JwtAccessService],
  exports: [JwtAccessService],
})
export class JwtAccessModule {}