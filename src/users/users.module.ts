import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtAccessModule } from '../auth/jwt/access/jwt.access.module';
import { JwtRefreshModule } from '../auth/jwt/refresh/jwt.refresh.module';
import { UploadsModule } from '../uploads/uploads.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    SessionsModule,
    JwtAccessModule,
    JwtRefreshModule,
    UploadsModule,
    VerificationCodeModule,
    PaginationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}