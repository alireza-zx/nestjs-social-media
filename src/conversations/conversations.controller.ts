import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { Serialize } from '../common/decorators/response-serializer.decorator';
import { ConversationResponseDto } from './dtos/conversation-response.dto';

@Controller('conversations')
@Serialize(ConversationResponseDto)
export class ConversationsController {
  constructor(
    // Inject ConversationsService
    private readonly conversationsService: ConversationsService
  ) {}

  @Get()
  public findAllConversations(@CurrentUser() user: User, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.conversationsService.findAllConversations(user, paginationQueryDto);
  }

  @Get(':id')
  public findOneConversation(@CurrentUser() user: User, @Param('id') id: string) {
    return this.conversationsService.findOneConversationById(user, id);
  }
}