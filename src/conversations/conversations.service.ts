import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { ConversationsGateway } from './conversations.gateway';

@Injectable()
export class ConversationsService {
  constructor(
    // Inject ConversationsRepository
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
    // Inject UsersService
    private readonly usersService: UsersService,
    // Inject PaginationService
    private readonly paginationService: PaginationService,
    // Inject ConversationsGateway
    private readonly conversationsGateway: ConversationsGateway,
  ) {}

  public async createConversation(user: User, user2: string | User) {
    let secondUser: User | undefined;
    if (typeof user2 === 'string')
      secondUser = await this.usersService.findOneUserById(user2);
    else secondUser = user2;

    const conversationInstance = this.conversationsRepository.create({
      user1: user,
      user2: secondUser,
    });

    return await this.conversationsRepository.save(conversationInstance);
  }

  public async findOneConversation(user1: User, user2: User) {
    if (user1 === user2)
      throw new BadRequestException();

    return await this.conversationsRepository.findOne({
      where: {
        user1: {
          id: user1.id,
        },
        user2: {
          id: user2.id,
        },
      },
    });
  }

  public async findAllConversations(
    user: User,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const conversations1 = await this.paginationService.paginate(
      this.conversationsRepository,
      paginationQueryDto,
      {
        where: ['user1', 'id', user.id],
      },
    );

    const conversations2 = await this.paginationService.paginate(
      this.conversationsRepository,
      paginationQueryDto,
      {
        where: ['user2', 'id', user.id],
      },
    );
    const conversations = [...conversations1, ...conversations2];
    const conversationsIds = conversations.map((c) => c.id);
    
    await this.conversationsGateway.joinConversations(user, conversationsIds);

    return conversations;
  }

  public async findOneConversationById(user: User, id: string) {
    const conversation = await this.conversationsRepository.findOne({
      where: [
        { user1: { id: user.id }, id },
        { user2: { id: user.id }, id }
      ]
    });
    if (!conversation)
      throw new NotFoundException('conversation not found');
    return conversation;
  }
}