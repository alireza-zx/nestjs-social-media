import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class FollowsService {
  constructor(
    // Inject FollowsRepository
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
    // Inject UsersService
    private readonly usersService: UsersService,
    // Inject PaginationService
    private readonly paginationService: PaginationService,
  ) {}

  public async follow(follower: User, followingId: string) {
    if (follower.id === followingId)
      throw new ConflictException("You can't follow yourself");

    const following = await this.usersService.findOneUserById(followingId);

    const followInstance = this.followsRepository.create({
      follower,
      following,
    });
    const follow = await this.followsRepository.save(followInstance);

    await this.usersService.addFollowing(follower);
    await this.usersService.addFollower(following);

    return follow;
  }

  public async unFollow(follower: User, followingId: string) {
    const following = await this.usersService.findOneUserById(followingId);

    const deleted = await this.followsRepository.delete({
      follower: { id: follower.id },
      following: { id: following.id },
    });

    if (deleted.affected === 0) throw new NotFoundException('user not found');

    await this.usersService.subtractFollower(following);
    await this.usersService.subtractFollowing(follower);

    return following;
  }

  public async findAllFollowers(
    user: User | string,
    paginationQueryDto: PaginationQueryDto,
  ) {
    if (typeof user === 'string') {
      user = await this.usersService.findOneUserById(user);
    }
    return await this.paginationService.paginate(
      this.followsRepository,
      paginationQueryDto,
      {
        where: ['following', 'id', user.id],
        relations: ['follower'],
      },
    );
  }

  public async findAllFollowings(
    user: User | string,
    paginationQueryDto: PaginationQueryDto,
  ) {
    if (typeof user === 'string') {
      user = await this.usersService.findOneUserById(user);
    }
    return await this.paginationService.paginate(
      this.followsRepository,
      paginationQueryDto,
      {
        where: ['follower', 'id', user.id],
        relations: ['following'],
      },
    );
  }
}
