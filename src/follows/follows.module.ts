import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { FollowsController } from './follows.controller';
import { UsersModule } from 'src/users/users.module';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow]),
    UsersModule,
    PaginationModule
  ],
  providers: [FollowsService],
  exports: [FollowsService],
  controllers: [FollowsController]
})
export class FollowsModule {}