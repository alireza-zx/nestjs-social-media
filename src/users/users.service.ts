import { Worker } from 'worker_threads';
import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ILike, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashPasswordProvider } from '../auth/providers/hash-password.provider';
import { SessionsService } from '../sessions/sessions.service';
import { JwtAccessService } from '../auth/jwt/access/jwt.access.service';
import { JwtRefreshService } from '../auth/jwt/refresh/jwt.refresh.service';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { UploadsService } from '../uploads/uploads.service';
import { VerificationCodeService } from '../verification-code/verification-code.service';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { PaginationService } from '../pagination/pagination.service';
import { PostsService } from '../posts/posts.service';
import path from 'path';

@Injectable()
export class UsersService {
  constructor(
    // Inject User repository
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    // Inject HashPasswordProvider
    @Inject(forwardRef(() => HashPasswordProvider))
    private readonly hashPasswordProvider: HashPasswordProvider,

    // Inject SessionsService
    private readonly sessionsService: SessionsService,

    // Inject JwtAccessService
    private readonly jwtAccessService: JwtAccessService,

    // Inject JwtRefreshService
    private readonly jwtRefreshService: JwtRefreshService,

    // Inject ConfigService
    private readonly configService: ConfigService,

    // Inject UploadsService
    private readonly uploadsService: UploadsService,

    // Inject VerificationCodeService
    private readonly verificationCodeService: VerificationCodeService,

    // Inject PaginationService
    private readonly paginationService: PaginationService
  ) {}

  public async createUser(createUserDto: CreateUserDto, verificationCode: number | undefined) {
    if (verificationCode && verificationCode > 100000)
      await this.verificationCodeService.verify(createUserDto.email, verificationCode);
    else {
      const emailVerificationCode = await this.verificationCodeService.sendVerificationEmail(createUserDto.email);
      throw new HttpException('email verification code has sent to your email. code will expire in 5 minutes', HttpStatus.OK);
    }
    // 1 & 2) verify or send email
    // 3) create user
    const userInstance = this.usersRepository.create(createUserDto);
    userInstance.username = userInstance.username.toLowerCase();
    // 4) hash password
    userInstance.password = await this.hashPasswordProvider.hashPassword(
      userInstance.password,
    );
    // 5) save user
    const user = await this.usersRepository.save(userInstance);
    // 6) create tokens
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtAccessService.signToken(payload);
    const refreshToken = await this.jwtRefreshService.signToken(payload);
    // 7) create session
    const session = await this.sessionsService.createSession(
      user,
      refreshToken,
    );
    return { user, session, accessToken, refreshToken };
  }

  public async findOneUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  public async findOneUserById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  public async findUsersByUsername(username: string, paginationQueryDto: PaginationQueryDto) {
    return await this.paginationService.paginate(
      this.usersRepository,
      paginationQueryDto,
      {
        where: ['username', 'none', ILike(`${username}%`)]
      }
    );
  }

  public async updateUser(user: User, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      user.passwordLastChanged = new Date();
      user.password = await this.hashPasswordProvider.hashPassword(
        updateUserDto.password,
      );
    }
    user.firstname = updateUserDto.firstname ?? user.firstname;
    user.lastname = updateUserDto.lastname ?? user.lastname;
    user.username = updateUserDto.username ?? user.username;
    user.email = updateUserDto.email ?? user.email;
    user.phone = updateUserDto.phone ?? user.phone;

    return await this.usersRepository.save(user);
  }

  public async updateAvatar(user: User, file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('please provide a file in file field');

    const upload = await this.uploadsService.createUploadAvatar(user, file);

    user.avatar = upload.filePath;

    return await this.usersRepository.save(user);
  }

  public async deleteUser(user: User) {
    return await this.usersRepository.remove(user);
  }

  public async addFollower(user: User) {
    await this.usersRepository.increment(
      { id: user.id },
      'followersCount',
      1
    );

    return await this.usersRepository.save(user);
  }

  public async subtractFollower(user: User) {
    await this.usersRepository.decrement(
      { id: user.id },
      'followersCount',
      1
    );

    return await this.usersRepository.save(user);
  }

  public async addFollowing(user: User) {
    await this.usersRepository.increment(
      { id: user.id },
      'followingsCount',
      1
    );

    return await this.usersRepository.save(user);
  }

  public async subtractFollowing(user: User) {
    await this.usersRepository.decrement(
      { id: user.id },
      'followersCount',
      1
    );

    return await this.usersRepository.save(user);
  }

  public async findAllUsers(paginationQueryDto: PaginationQueryDto) {
    return await this.paginationService.paginate(
      this.usersRepository,
      paginationQueryDto
    );
  }

  public async updateOneUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneUserById(id);
    if (updateUserDto.password) {
      user.passwordLastChanged = new Date();
      user.password = await this.hashPasswordProvider.hashPassword(
        updateUserDto.password,
      );
    }
    user.firstname = updateUserDto.firstname ?? user.firstname;
    user.lastname = updateUserDto.lastname ?? user.lastname;
    user.username = updateUserDto.username ?? user.username;
    user.email = updateUserDto.email ?? user.email;
    user.phone = updateUserDto.phone ?? user.phone;

    return await this.usersRepository.save(user);
  }

  public async deleteOneUser(id: string) {
    return await this.usersRepository.delete({ id });
  }
}