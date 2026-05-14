import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { User } from 'src/users/user.entity';
import slugify from 'slugify';
import { ConfigService } from '@nestjs/config';
import { UploadsService } from 'src/uploads/uploads.service';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { TagsService } from 'src/tags/tags.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    // Inject PostsRepository
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    // Inject ConfigService
    private readonly configService: ConfigService,
    // Inject UploadsService
    private readonly uploadsService: UploadsService,
    // Inject TagsService
    private readonly tagsService: TagsService,
    // Inject PaginaionService
    private readonly paginationService: PaginationService,
  ) {}

  public async createPost(createPostDto: CreatePostDto, user: User) {
    // Upload
    const upload = await this.uploadsService.findOneUpload(
      createPostDto.fileId,
    );
    if (upload.user.id !== user.id)
      throw new ForbiddenException("you didn't upload this file");

    // check if file exists in another post
    const post = await this.postsRepository.findOne({
      where: {
        upload: { id: upload.id },
      },
    });
    if (post)
      throw new BadRequestException('file already belongs to another post');

    // Post
    const postInstance = this.postsRepository.create(createPostDto);
    postInstance.slug = slugify(postInstance.title);
    postInstance.author = user;
    postInstance.fileMimeType = upload.fileMimeType;
    postInstance.type = upload.postType;
    postInstance.fileUrl = upload.filePath;
    postInstance.upload = upload;

    // Tags
    let tags: Tag[] | undefined;
    if (createPostDto.tagsIds) {
      tags = await this.tagsService.findTagsById(createPostDto.tagsIds);
      if (!tags) throw new NotFoundException('no tags found');
      postInstance.tags = tags;
    }
    const savedPost = await this.postsRepository.save(postInstance);

    await this.tagsService.addPost(tags);

    return savedPost;
  }

  public async findAllPosts(paginationQueryDto: PaginationQueryDto) {
    return await this.paginationService.paginate(
      this.postsRepository,
      paginationQueryDto,
      { relations: ['author'] },
    );
  }

  public async findMyPosts(user: User, paginationQueryDto: PaginationQueryDto) {
    return await this.paginationService.paginate(
      this.postsRepository,
      paginationQueryDto,
      {
        where: ['author', 'id', user.id],
      },
    );
  }

  public async findOnePost(id: string) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });
    if (!post) throw new NotFoundException('post not found');
    return post;
  }

  public async updatePost(
    user: User,
    id: string,
    updatePostDto: UpdatePostDto,
  ) {
    if (updatePostDto.fileId)
      throw new BadRequestException("you can't update file");
    const post = await this.postsRepository.findOne({
      where: {
        id,
        author: { id: user.id },
      },
    });
    if (!post) throw new NotFoundException('post not found');

    if (updatePostDto.tagsIds) {
      const tags = await this.tagsService.findTagsById(updatePostDto.tagsIds);

      post.tags = tags;
    }

    post.title = updatePostDto.title ?? post.title;
    post.slug = slugify(updatePostDto.title ?? post.title);
    post.description = updatePostDto.description ?? post.description;

    return await this.postsRepository.save(post);
  }

  public async deletePost(user: User, id: string) {
    const post = await this.postsRepository.findOne({
      where: {
        author: { id: user.id },
        id,
      },
      relations: {
        upload: true,
      },
    });
    if (!post) throw new NotFoundException('post not found');
    const deletedPost = await this.postsRepository.remove(post);
    if (post.tags) {
      await this.tagsService.subtractPost(post.tags);
    }
    return deletedPost;
  }

  public async like(post: Post) {
    await this.postsRepository.increment(
      {
        id: post.id
      },
      'likesCount',
      1
    );
    return await this.postsRepository.save(post);
  }

  public async unLike(post: Post) {
    await this.postsRepository.decrement(
      {
        id: post.id
      },
      'likesCount',
      1
    );
    return await this.postsRepository.save(post);
  }

  public async addComment(post: Post) {
    await this.postsRepository.increment(
      {
        id: post.id
      },
      'commentsCount',
      1
    );
    return await this.postsRepository.save(post);
  }

  public async subtractComment(post: Post) {
    await this.postsRepository.decrement(
      {
        id: post.id
      },
      'commentsCount',
      1
    );
    return await this.postsRepository.save(post);
  }
}