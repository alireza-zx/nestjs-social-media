import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { ConversationsService } from '../conversations/conversations.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesGateway } from './messages.gateway';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { ConversationsGateway } from '../conversations/conversations.gateway';

@Injectable()
export class MessagesService {
  constructor(
    // Inject MessagesRepository
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    // Inject UsersService
    private readonly usersService: UsersService,
    // Inject ConversationsService
    private readonly conversationsService: ConversationsService,
    // Inject MessagesGateway
    private readonly messagesGateway: MessagesGateway,
    // Inject ConversationsGateway
    private readonly conversationsGateway: ConversationsGateway
  ) {}

  public async sendMessage(
    user: User,
    userId: string,
    createMessageDto: CreateMessageDto,
  ) {
    const secondUser = await this.usersService.findOneUserById(userId);

    let conversation = await this.conversationsService.findOneConversation(
      user,
      secondUser,
    );

    if (!conversation) {
      conversation = await this.conversationsService.createConversation(
        user,
        secondUser,
      );
      this.conversationsGateway.joinConversations(user, [conversation.id]);
    }

    const messageInstance = this.messagesRepository.create(createMessageDto);
    messageInstance.sender = user;
    messageInstance.conversation = conversation;
    const message = await this.messagesRepository.save(messageInstance);

    this.messagesGateway.handleSendMessage(conversation.id, message);
  }

  public async deleteMessage(user: User, id: string, conversationId: string) {
    await this.messagesRepository.delete({ id, sender: { id: user.id }, conversation: { id: conversationId } });
    this.messagesGateway.handleDeleteMessage(conversationId, id);
  }

  public async updateMessage(user: User, id: string, conversationId: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.messagesRepository.findOne({
      where: { id, sender: { id: user.id }, conversation: { id: conversationId } },
      relations: ['sender']
    });
    if (!message)
      throw new NotFoundException('message not found');

    const updatedMessage = await this.messagesRepository.save(message);
    this.messagesGateway.handleUpdateMessage(conversationId, id, updatedMessage);
  }
}