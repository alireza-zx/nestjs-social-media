import { Module } from '@nestjs/common';
import { JwtRefreshService } from './jwt.refresh.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.refreshSecret'),
        signOptions: {
          expiresIn: configService.get('jwt.refreshTtl'),
        },
      }),
    }),
  ],
  providers: [JwtRefreshService],
  exports: [JwtRefreshService],
})
export class JwtRefreshModule {}
