import { NotFoundException } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { User } from 'src/users/user.entity';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: process.env.CORS_ORIGIN
  }
})
export class ConversationsGateway extends BaseGateway {
  constructor(
    // Inject AuthService
    authService: AuthService
  ) {
    super(authService);
  }

  @WebSocketServer()
  public readonly server: Server;

  public async joinConversations(user: User, conversationsIds: string[]) {
    const sockets = await this.server.fetchSockets();
    const targetSocket = sockets.find(socket => socket.data.user.id === user.id);
    
    targetSocket?.join(conversationsIds);
  }
}