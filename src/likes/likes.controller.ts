import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { Serialize } from 'src/common/decorators/response-serializer.decorator';
import { LikeResponseDto } from './dtos/like-response.dto';

@Controller('likes')
@Serialize(LikeResponseDto)
export class LikesController {
  constructor(
    // Inject LikesService
    private readonly likesService: LikesService
  ) {}

  @Post('/:postId')
  public likePost(@CurrentUser() user: User, @Param('postId') postId: string) {
    return this.likesService.likePost(user, postId);
  }

  @Delete('/:postId')
  public unlikePost(@CurrentUser() user: User, @Param('postId') postId: string) {
    return this.likesService.unlikePost(user, postId);
  }

  @Get('/:postId')
  public findLikes(@Param('postId') postId: string, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.likesService.findLikes(postId, paginationQueryDto);
  }
}