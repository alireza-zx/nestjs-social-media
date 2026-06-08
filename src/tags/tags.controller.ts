import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { CreateTagDto } from './dtos/create-tag.dto';
import { Serialize } from '../common/decorators/response-serializer.decorator';
import { TagResponseDto } from './dtos/tag-response.dto';
import { Role } from '../common/decorators/role.decorator';
import { Roles } from '../users/enums/roles.enum';
import { Throttle } from '@nestjs/throttler';

@Controller('tags')
@Serialize(TagResponseDto)
export class TagsController {
  constructor(
    // Inject TagsService
    private readonly tagsService: TagsService
  ) {}

  @Get()
  public findAllTags(@Query() query: PaginationQueryDto) {
    return this.tagsService.findAllTags(query);
  }

  @Get('/:id')
  public findOneTag(@Param('id') id: string) {
    return this.tagsService.findTagsById([id]);
  }

  @Post()
  public createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @Delete('/:id')
  @Throttle({ default: { limit: 300, ttl: 60000 } })
  @Role([Roles.ADMIN])
  public async deleteTagAdmin(@Param('id') id: string) {
    return this.tagsService.deleteTagAdmin(id);
  }
}