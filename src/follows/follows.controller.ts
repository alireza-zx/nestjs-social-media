import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { Serialize } from '../common/decorators/response-serializer.decorator';
import { FollowResponseDto } from './dtos/follow-response.dto';

@Controller('follows')
@Serialize(FollowResponseDto)
export class FollowsController {
  constructor(
    // Inject FollowsService
    private readonly followsService: FollowsService
  ) {}

  @Post('/:userId')
  public follow(@CurrentUser() user: User, @Param('userId') userId: string) {
    return this.followsService.follow(user, userId);
  }

  @Delete('/:userId')
  public async unFollow(@CurrentUser() user: User, @Param('userId') userId: string) {
    const following = await this.followsService.unFollow(user, userId);

    return {
      message: `successfully unfollowed ${following.username}`
    }
  }

  @Get('/followers')
  public findAllFollowers(@CurrentUser() user: User, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.followsService.findAllFollowers(user, paginationQueryDto);
  }

  @Get('/followings')
  public findAllFollowings(@CurrentUser() user: User, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.followsService.findAllFollowings(user, paginationQueryDto);
  }

  @Get('/followers/:userId')
  public findAllFollowersOf(@Param('userId') userId: string, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.followsService.findAllFollowers(userId, paginationQueryDto);
  }

  @Get('/followings/:userId')
  public findAllFollowingsOf(@Param('userId') userId: string, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.followsService.findAllFollowings(userId, paginationQueryDto);
  }
}