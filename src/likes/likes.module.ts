import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { LikesController } from './likes.controller';
import { PostsModule } from 'src/posts/posts.module';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    PostsModule,
    PaginationModule
  ],
  providers: [LikesService],
  controllers: [LikesController]
})
export class LikesModule {}