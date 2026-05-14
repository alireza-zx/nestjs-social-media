import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { CreateTagDto } from './dtos/create-tag.dto';
import { Serialize } from 'src/common/decorators/response-serializer.decorator';
import { TagResponseDto } from './dtos/tag-response.dto';

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
}