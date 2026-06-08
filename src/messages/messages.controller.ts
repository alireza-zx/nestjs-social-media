import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { Serialize } from '../common/decorators/response-serializer.decorator';
import { MessageResponseDto } from './dtos/message-response.dto';

@Controller('messages')
@Serialize(MessageResponseDto)
export class MessagesController {
  constructor(
    // Inject MessagesService
    private readonly messagesService: MessagesService,
  ) {}

  @Post('/:userId')
  public sendMessage(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
    @Body() createMessageDto: CreateMessageDto
  ) {
    return this.messagesService.sendMessage(user, userId, createMessageDto);
  }

  @Delete('/:conversationId/:id')
  public deleteMessage(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('conversationId') conversationId: string
  ) {
    return this.messagesService.deleteMessage(user, id, conversationId);
  }

  @Patch('/:conversationId/:id')
  public updateMessage(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('conversationId') conversationId: string,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    return this.messagesService.updateMessage(user, id, conversationId, updateMessageDto);
  }
}