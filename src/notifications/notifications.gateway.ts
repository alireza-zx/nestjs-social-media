import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { User } from 'src/users/user.entity';
import { Notification } from './notification.entity';
import { ServerEventNames } from 'src/common/events/websocket-events.interface';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN },
  namespace: '/notification'
})
export class NotificationsGateway extends BaseGateway {
  constructor(
    @Inject(forwardRef(() => AuthService))
    authService: AuthService
  ) {
    super(authService);
  }
  @WebSocketServer()
  public readonly server: Server;

  public async handleNewNotification(user: User, notification: Notification) {
    const socket = (await this.server.fetchSockets()).find(socket => socket.data.user.id === user.id);
    socket?.emit(ServerEventNames.NEW_NOTIFICATION, notification);
  }
}