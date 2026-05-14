import { OnGatewayConnection, OnGatewayDisconnect, WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';

export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    // Inject AuthService
    protected readonly authService: AuthService
  ) {}

  public async handleDisconnect(client: Socket) {}

  public async handleConnection(client: Socket, ...args: any[]) {
    try {
      const accessToken = this.authService.extractAccessTokenFromSocket(client);
      if (!accessToken) throw new UnauthorizedException();

      const user = await this.authService.authenticateAccessToken(accessToken);
      
      client.data.user = user;
    } catch (err) {
      client.disconnect(true);
    }
  }
}