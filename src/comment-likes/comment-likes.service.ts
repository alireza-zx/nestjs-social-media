import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentLike } from './comment-like.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class CommentLikesService {
  constructor(
    // Inject CommentLikesRepository
    @InjectRepository(CommentLike)
    private readonly commentLikesRepostiory: Repository<CommentLike>,
    // Inject CommentsService
    private readonly commentsService: CommentsService,
  ) {}

  public async likeComment(user: User, commentId: string) {
    const comment = await this.commentsService.findOneComment(commentId);
    const commentLikeInstance = this.commentLikesRepostiory.create({
      user,
      comment,
    });
    const commentLike = await this.commentLikesRepostiory.save(commentLikeInstance);

    await this.commentsService.likeComment(comment);
    return commentLike;
  }

  public async unlikeComment(user: User, commentId: string) {
    const comment = await this.commentsService.findOneComment(commentId);
    const commentLike = await this.commentLikesRepostiory.findOne({
      where: {
        comment: { id: comment.id },
        user: { id: user.id },
      },
    });
    if (!commentLike) return;

    const deletedCommentLike = await this.commentLikesRepostiory.remove(commentLike);
    await this.commentsService.unlikeComment(comment);

    return deletedCommentLike;
  }
}