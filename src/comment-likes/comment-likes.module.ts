import { Module } from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLike } from './comment-like.entity';
import { CommentLikesController } from './comment-likes.controller';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentLike]),
    CommentsModule
  ],
  providers: [CommentLikesService],
  controllers: [CommentLikesController]
})
export class CommentLikesModule {}