import { Controller, Delete, Param, Post } from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/common/decorators/response-serializer.decorator';
import { CommentLikeResponseDto } from './dtos/comment-like-response.dto';

@Controller('comment-likes')
@Serialize(CommentLikeResponseDto)
export class CommentLikesController {
  constructor(
    // Inject CommentLikesService
    private readonly commentLikesService: CommentLikesService
  ) {}

  @Post('/:commentId')
  public likeComment(@Param('commentId') commentId: string, @CurrentUser() user: User) {
    return this.commentLikesService.likeComment(user, commentId);
  }

  @Delete('/:commentId')
  public unlikeComment(@Param('commentId') commentId: string, @CurrentUser() user: User) {
    return this.commentLikesService.unlikeComment(user, commentId);
  }
}