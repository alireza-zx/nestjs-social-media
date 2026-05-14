import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { HashPasswordProvider } from './providers/hash-password.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessModule } from './jwt/access/jwt.access.module';
import { JwtRefreshModule } from './jwt/refresh/jwt.refresh.module';
import { CookieAuthGuard } from './guards/cookieAuth.guard';
import { HashTokenProvider } from './providers/hash-token.provider';
import { SessionsModule } from '../sessions/sessions.module';

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
    forwardRef(() => UsersModule),
    forwardRef(() => SessionsModule),
    JwtAccessModule,
    JwtRefreshModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashPasswordProvider,
      useClass: BcryptProvider,
    },
    CookieAuthGuard,
    HashTokenProvider
  ],
  exports: [HashPasswordProvider, CookieAuthGuard, HashTokenProvider, AuthService],
})
export class AuthModule {}