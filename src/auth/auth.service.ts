import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dtos/sign-in.dto';
import { HashPasswordProvider } from './providers/hash-password.provider';
import { JwtAccessService } from './jwt/access/jwt.access.service';
import { JwtRefreshService } from './jwt/refresh/jwt.refresh.service';
import { SessionsService } from '../sessions/sessions.service';
import { User } from '../users/user.entity';
import { UserPayload } from './interfaces/user-payload.interface';
import { Socket } from 'socket.io';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    // Inject UsersService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    // Inject HashPasswordProvider
    private readonly hashPasswordProvider: HashPasswordProvider,
    // Inject JwtAccessService
    private readonly jwtAccessService: JwtAccessService,
    // Inject JwtRefreshService
    private readonly jwtRefreshService: JwtRefreshService,
    // Inject SessionsService
    @Inject(forwardRef(() => SessionsService))
    private readonly sessionsService: SessionsService,
    // Inject MailService
    private readonly mailService: MailService,
    // Inject NotificatinsGateway
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService
  ) {}

  public async signup(createUserDto: CreateUserDto, verificationCode: number | undefined) {
    // 1) create user & session
    const user = await this.usersService.createUser(createUserDto, verificationCode);
    
    await this.notificationsService.createNotification(user.user, {
      title: `Dear ${user.user.firstname}, Welcome to NestJS social media!`,
      description: ''
    });

    return user;
  }

  public async signin(signInDto: SignInDto) {
    // 1) find user with provided email
    const user = await this.usersService.findOneUserByEmail(signInDto.email);
    // 2) compare passwords
    if (
      !user ||
      !(await this.hashPasswordProvider.comparePassword(
        signInDto.password,
        user.password,
      ))
    )
      throw new UnauthorizedException('email or password is invalid');
    // 3) generate jwt tokens
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtAccessService.signToken(payload);
    const refreshToken = await this.jwtRefreshService.signToken(payload);
    // 4) create session
    const { savedSession, expiresAt } =
      await this.sessionsService.createSession(user, refreshToken);

    await this.notificationsService.createNotification(user, {
      title: `Dear ${user.firstname}, We detected a new sign-in to your account!`,
      description: "if that isn't you, you can terminate other sessions in settings"
    });

    return { user, accessToken, refreshToken, savedSession, expiresAt };
  }

  public async signinAgain(signInDto: SignInDto, oldRefreshToken: string) {
    // 1) find user with provided email
    const user = await this.usersService.findOneUserByEmail(signInDto.email);
    // 2) compare passwords
    if (
      !user ||
      !(await this.hashPasswordProvider.comparePassword(
        signInDto.password,
        user.password,
      ))
    )
      throw new UnauthorizedException('email or password is invalid');
    // 3) generate jwt tokens
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtAccessService.signToken(payload);
    const refreshToken = await this.jwtRefreshService.signToken(payload);
    // update session
    const { savedSession, expiresAt } =
      await this.sessionsService.updateSession(
        user,
        refreshToken,
        oldRefreshToken,
      );
    
    return { user, accessToken, refreshToken, savedSession, expiresAt };
  }

  public async refresh(refreshToken: string) {
    // 1) verify refresh token
    const payload = await this.jwtRefreshService.verifyToken(refreshToken);
    // 2) fetch user from database
    const user = await this.usersService.findOneUserByEmail(payload.email);
    if (!user) throw new NotFoundException('user is deleted');
    const session = await this.sessionsService.findOneSessionByTokenAndUser(
      refreshToken,
      user,
    );
    if (!session) throw new UnauthorizedException('session not found');
    // if session is expired
    if (session.expiresAt.getTime() < Date.now())
      throw new UnauthorizedException('session expired');
    // 4) check if user recently changed password
    if (user.passwordLastChanged.getTime() / 1000 - 1 > payload.iat)
      throw new UnauthorizedException(
        'User has recently changed their password',
      );
    // 3) create access token
    const payloadAccess: UserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return await this.jwtAccessService.signToken(payloadAccess);
  }

  public async signout(refreshToken: string, user: User) {
    // 1) find session and delete
    await this.sessionsService.deleteOneSessionByTokenAndUser(
      refreshToken,
      user,
    );
  }

  public async signoutAll(refreshToken: string, user: User) {
    await this.sessionsService.deleteAllExceptCurrent(refreshToken, user);
  }

  public async authenticateAccessToken(accessToken: string) {
    const payload = await this.jwtAccessService.verifyToken(accessToken);

    const user = await this.usersService.findOneUserById(payload.sub);

    if (user.passwordLastChanged.getTime() / 1000 - 1 > payload.iat)
      throw new UnauthorizedException(
        'User has recently changed their password',
      );

    return user;
  }

  public extractAccessTokenFromSocket(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      return token;
    }
    return null;
  }
}
