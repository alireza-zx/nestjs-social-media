import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '../../interfaces/user-payload.interface';

@Injectable()
export class JwtRefreshService {
  constructor(
    // Inject JwtService
    private readonly jwtService: JwtService,
    // Inject ConfigService
    private readonly configService: ConfigService,
  ) {}

  public async signToken(payload: UserPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshTtl'),
    });
  }

  public async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('jwt.refreshSecret'),
    });
  }
}
