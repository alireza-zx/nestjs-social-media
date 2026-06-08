import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { FollowsController } from './follows.controller';
import { UsersModule } from '../users/users.module';
import { PaginationModule } from '../pagination/pagination.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow]),
    UsersModule,
    PaginationModule,
    NotificationsModule
  ],
  providers: [FollowsService],
  exports: [FollowsService],
  controllers: [FollowsController]
})
export class FollowsModule {}