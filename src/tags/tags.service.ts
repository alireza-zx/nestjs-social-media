import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { In, Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { CreateTagDto } from './dtos/create-tag.dto';
import slugify from 'slugify';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class TagsService {
  constructor(
    // Inject TagsRepository
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    // Inject PaginationService
    private readonly paginationService: PaginationService,
  ) {}

  public async createTag(createTagDto: CreateTagDto) {
    const tagInstance = this.tagsRepository.create(createTagDto);
    tagInstance.slug = slugify(tagInstance.title);

    return await this.tagsRepository.save(tagInstance);
  }

  public async findAllTags(paginationQueryDto: PaginationQueryDto) {
    return await this.paginationService.paginate(
      this.tagsRepository,
      paginationQueryDto,
    );
  }

  public async findTagsById(ids: string[]) {
    return await this.tagsRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  public async addPost(tags: Tag[] | undefined) {
    if (!tags) return;

    for (let i = 0; i < tags.length; i++) {
      await this.tagsRepository.increment({
        id: tags[i].id
      },
      'postsCount',
      1
      );
    }
    return await this.tagsRepository.save(tags);
  }

  public async subtractPost(tags: Tag[]) {
    for (let i = 0; i < tags.length; i++) {
      await this.tagsRepository.decrement({
        id: tags[i].id
      },
      'postsCount',
      1
      );
    }
    return await this.tagsRepository.save(tags);
  }
}
