import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './message.entity';
import { AuthService } from 'src/auth/auth.service';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { EventsPayloadsMap, ServerEventNames } from 'src/common/events/websocket-events.interface';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true
  },
})
export class MessagesGateway extends BaseGateway {
  constructor(
    // Inject AuthService
    authService: AuthService
  ) {
    super(authService);
  }

  @WebSocketServer()
  public readonly server: Server;

  public handleSendMessage(conversationId: string, message: Message) {
    const payload: EventsPayloadsMap[ServerEventNames.NEW_MESSAGE] = {
      message
    }
    this.server.to(conversationId).emit(ServerEventNames.NEW_MESSAGE, payload, conversationId);
  }

  public handleDeleteMessage(conversationId: string, messageId: string) {
    this.server.to(conversationId).emit(ServerEventNames.DELETE_MESSAGE, messageId, conversationId);
  }

  public handleUpdateMessage(conversationId: string, messageId: string, updatedMessage: Message) {
    const payload: EventsPayloadsMap[ServerEventNames.UPDATE_MESSAGE] = {
      messageId,
      updatedMessage
    }
    this.server.to(conversationId).emit(ServerEventNames.UPDATE_MESSAGE, payload, conversationId);
  }
}