import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { ConversationsGateway } from './conversations.gateway';
import { UsersModule } from 'src/users/users.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    UsersModule,
    PaginationModule,
    AuthModule
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsGateway],
  exports: [ConversationsService, ConversationsGateway]
})
export class ConversationsModule {}