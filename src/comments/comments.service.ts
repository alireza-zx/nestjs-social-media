import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { PostsService } from 'src/posts/posts.service';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class CommentsService {
  constructor(
    // Inject CommentsRepository
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    // Inject PostsService
    private readonly postsService: PostsService,
    // Inject PaginationService
    private readonly paginationService: PaginationService,
  ) {}

  public async findAllComments(
    postId: string,
    paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.paginationService.paginate(
      this.commentsRepository,
      paginationQueryDto,
      { where: ['post', 'id', postId] },
    );
  }

  public async findOneComment(id: string) {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException('comment not found');
    return comment;
  }

  public async createComment(
    user: User,
    createCommentDto: CreateCommentDto,
    postId: string,
  ) {
    const post = await this.postsService.findOnePost(postId);

    const commentInstance = this.commentsRepository.create(createCommentDto);
    commentInstance.post = post;
    commentInstance.user = user;

    await this.postsService.addComment(post);
    return await this.commentsRepository.save(commentInstance);
  }

  public async deleteComment(user: User, commentId: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId, user: { id: user.id } },
      relations: { post: true },
    });
    if (!comment) throw new NotFoundException('commnet not found');

    const post = await this.postsService.findOnePost(comment.post.id);
    await this.commentsRepository.remove(comment);
    await this.postsService.subtractComment(post);
  }

  public async likeComment(comment: Comment) {
    await this.commentsRepository.increment(
      {
        id: comment.id
      },
      'likesCount',
      1
    );
    return await this.commentsRepository.save(comment);
  }

  public async unlikeComment(comment: Comment) {
    await this.commentsRepository.decrement(
      {
        id: comment.id
      },
      'likesCount',
      1
    );
    return await this.commentsRepository.save(comment);
  }
}
