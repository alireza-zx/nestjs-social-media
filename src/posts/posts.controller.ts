import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { Serialize } from 'src/common/decorators/response-serializer.decorator';
import { PostResponseDto } from './dtos/post-response.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/users/enums/roles.enum';
import { Throttle } from '@nestjs/throttler';

@Controller('posts')
@Serialize(PostResponseDto)
export class PostsController {
  constructor(
    // Inject PostsService
    private readonly postsService: PostsService
  ) {}

  @Post()
  public createPost(@CurrentUser() user: User, @Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto, user);
  }

  @Get()
  public findAllPosts(@Query() query: PaginationQueryDto) {
    return this.postsService.findAllPosts(query);
  }

  @Get('/user/:userId')
  public findUserPosts(@Query() paginationQueryDto: PaginationQueryDto, @Param('userId') userId: string) {
    return this.postsService.findUserPosts(userId, paginationQueryDto);
  }

  @Get('/me')
  public findMyPosts(@CurrentUser() user: User, @Query() query: PaginationQueryDto) {
    return this.postsService.findMyPosts(user, query);
  }

  @Get('/:id')
  public findOnePost(@Param('id') id: string) {
    return this.postsService.findOnePost(id);
  }

  @Patch('/:id')
  public updatePost(@CurrentUser() user: User, @Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(user, id, updatePostDto);
  }

  @Delete('/:id')
  public async deletePost(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.postsService.deletePost(user, id);
  }

  @Delete('/admin/:id')
  @Role([Roles.ADMIN])
  @Throttle({ default: { limit: 300, ttl: 60000 } })
  public async deleteOnePostAdmin(@Param('id') id: string) {
    return this.postsService.deleteOnePostAdmin(id);
  }
}