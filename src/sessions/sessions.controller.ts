import { Controller, Delete, Get } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Cookie } from '../common/decorators/cookie.decorator';
import { Serialize } from '../common/decorators/response-serializer.decorator';
import { SessionResponseDto } from './dtos/session-response.dto';

@Controller('sessions')
@Serialize(SessionResponseDto)
export class SessionsController {
  constructor(
    // Inject SessionsService
    private readonly sessionsService: SessionsService
  ) {}

  @Get()
  public getAllSessions(@CurrentUser() user: User) {
    return this.sessionsService.findAllSessions(user);
  }

  @Get('/current')
  public getCurrentSession(@CurrentUser() user: User, @Cookie() cookies) {
    return this.sessionsService.findOneSessionByTokenAndUser(cookies.refreshToken, user);
  }
}