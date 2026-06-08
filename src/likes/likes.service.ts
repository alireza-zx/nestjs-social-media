import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { PostsService } from '../posts/posts.service';
import { PaginationService } from '../pagination/pagination.service';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';

@Injectable()
export class LikesService {
  constructor(
    // Inject LikesRepository
    @InjectRepository(Like) private readonly likesRepository: Repository<Like>,
    // Inject PostsService
    private readonly postsService: PostsService,
    // Inject PaginationService
    private readonly paginationService: PaginationService,
  ) {}

  public async findLikes(
    postId: string,
    paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.paginationService.paginate(
      this.likesRepository,
      paginationQueryDto,
      {
        where: ['post', 'id', postId],
        relations: ['user'],
      },
    );
  }

  public async likePost(user: User, postId: string) {
    const post = await this.postsService.findOnePost(postId);
    const likeInstance = this.likesRepository.create({ user, post });
    const like = await this.likesRepository.save(likeInstance);
    await this.postsService.like(post);

    return like;
  }

  public async unlikePost(user: User, postId: string) {
    const post = await this.postsService.findOnePost(postId);
    const like = await this.likesRepository.findOneBy({
      user: { id: user.id },
      post: { id: postId },
    });
    if (!like) return;
    await this.likesRepository.remove(like);
    await this.postsService.unLike(post);
  }
}
