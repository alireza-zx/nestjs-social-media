import { forwardRef, Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { AuthModule } from '../auth/auth.module';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    forwardRef(() => AuthModule)
  ],
  providers: [SessionsService],
  exports: [SessionsService],
  controllers: [SessionsController]
})
export class SessionsModule {}