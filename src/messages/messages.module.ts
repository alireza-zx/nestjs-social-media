import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';
import { UsersModule } from '../users/users.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    UsersModule,
    ConversationsModule,
    AuthModule
  ],
  providers: [MessagesService, MessagesGateway],
  exports: [MessagesGateway],
  controllers: [MessagesController]
})
export class MessagesModule {}