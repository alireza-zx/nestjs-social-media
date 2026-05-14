import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { HashTokenProvider } from '../auth/providers/hash-token.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionsService {
  constructor(
    // Inject SessionsRepository
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,

    // Inject HashTokenProvider
    @Inject(forwardRef(() => HashTokenProvider))
    private readonly hashTokenProvider: HashTokenProvider,

    // Inject ConfigService
    private readonly configService: ConfigService,
  ) {}

  public async createSession(user: User, token: string) {
    const expireTime = this.configService.get('jwt.refreshTtlMs') ?? 604800000;
    const sessionInstance = this.sessionsRepository.create();
    sessionInstance.user = user;
    sessionInstance.token = await this.hashTokenProvider.hashToken(token);
    sessionInstance.expiresAt = new Date(Date.now() + expireTime);
    const savedSession = await this.sessionsRepository.save(sessionInstance);

    return { savedSession, expiresAt: savedSession['expiresAt'] };
  }

  public async findAllSessions(user: User) {
    return await this.sessionsRepository.find({
      where: {
        user: { id: user.id },
      },
    });
  }

  public async findOneSessionByTokenAndUser(token: string, user: User) {
    return await this.sessionsRepository.findOne({
      where: {
        token: await this.hashTokenProvider.hashToken(token),
        user: { id: user.id },
      },
    });
  }

  public async deleteOneSessionByTokenAndUser(token: string, user: User) {
    await this.sessionsRepository.delete({
      token: await this.hashTokenProvider.hashToken(token),
      user: { id: user.id },
    });
  }

  public async deleteAllExceptCurrent(refreshToken: string, user: User) {
    const sessions = await this.findAllSessions(user);
    const hashedToken = await this.hashTokenProvider.hashToken(refreshToken);

    const sessionsToDelete = sessions.filter(
      (session) => session.token !== hashedToken,
    );

    await this.sessionsRepository.remove(sessionsToDelete);
  }

  public async updateSession(
    user: User,
    refreshToken: string,
    oldRefreshToken: string,
  ) {
    const expireTime = this.configService.get('jwt.refreshTtlMs') ?? 604800000;
    const session = await this.findOneSessionByTokenAndUser(
      oldRefreshToken,
      user,
    );

    if (!session) return await this.createSession(user, refreshToken);

    session.token = await this.hashTokenProvider.hashToken(refreshToken);
    session.expiresAt = new Date(Date.now() + expireTime);

    const savedSession = await this.sessionsRepository.save(session);

    return { savedSession, expiresAt: savedSession['expireAt'] };
  }
}
