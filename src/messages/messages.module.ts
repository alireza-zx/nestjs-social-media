import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';
import { UsersModule } from 'src/users/users.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { AuthModule } from 'src/auth/auth.module';

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