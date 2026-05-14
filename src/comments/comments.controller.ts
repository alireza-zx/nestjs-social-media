import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { Serialize } from 'src/common/decorators/response-serializer.decorator';
import { CommentResponseDto } from './dtos/comment-response.dto';

@Controller('comments')
@Serialize(CommentResponseDto)
export class CommentsController {
  constructor(
    // Inject CommentsService
    private readonly commentsService: CommentsService
  ) {}

  @Get('/:postId')
  public findAllComments(
    @Param('postId') postId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.commentsService.findAllComments(postId, query);
  }

  @Post('/:postId')
  public createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @CurrentUser() user: User
  ) {
    return this.commentsService.createComment(user, createCommentDto, postId);
  }

  @Delete('/:commentId')
  public async deleteComment(
    @CurrentUser() user: User,
    @Param('commentId') commentId: string
  ) {
    await this.commentsService.deleteComment(user, commentId);
    return {
      message: 'comment successfully deleted'
    }
  }
}